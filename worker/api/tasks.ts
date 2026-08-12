import { first, query, run } from "../lib/db";
import { error, json, methodNotAllowed, notFound } from "../lib/http";
import {
	optionalDate,
	optionalNumber,
	optionalString,
	readJson,
	requiredString,
} from "../lib/validation";

interface TaskRow {
	id: string;
	goal_id: string | null;
	title: string;
	description: string | null;
	status: string;
	priority: number;
	estimated_minutes: number | null;
	actual_minutes: number;
	due_at: string | null;
	completed_at: string | null;
	created_at: string;
	updated_at: string;
}

function taskId() {
	return `TSK-${crypto.randomUUID()}`;
}

export async function tasksApi(
	request: Request,
	env: Env,
): Promise<Response> {
	const url = new URL(request.url);
	const id = url.pathname.split("/").pop();

	if (request.method === "GET") {
		if (id && id !== "tasks") {
			const task = await first<TaskRow>(
				env.DB,
				"SELECT * FROM tasks WHERE id = ?",
				[id],
			);

			return task ? json(task) : notFound("Task not found");
		}

		const status = url.searchParams.get("status");

		const tasks = status
			? await query<TaskRow>(
					env.DB,
					`SELECT *
					 FROM tasks
					 WHERE status = ?
					 ORDER BY priority DESC, due_at ASC, created_at DESC`,
					[status],
				)
			: await query<TaskRow>(
					env.DB,
					`SELECT *
					 FROM tasks
					 ORDER BY priority DESC, due_at ASC, created_at DESC`,
				);

		return json(tasks);
	}

	if (request.method === "POST") {
		try {
			const body = await readJson(request);

			const id = taskId();
			const title = requiredString(body.title, "title", 200);
			const description = optionalString(body.description, 2000);
			const goalId = optionalString(body.goalId, 100);
			const status = optionalString(body.status, 30) ?? "todo";
			const priority = optionalNumber(body.priority) ?? 0;
			const estimatedMinutes = optionalNumber(body.estimatedMinutes);
			const dueAt = optionalDate(body.dueAt);

			await run(
				env.DB,
				`INSERT INTO tasks (
					id,
					goal_id,
					title,
					description,
					status,
					priority,
					estimated_minutes,
					due_at
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					id,
					goalId,
					title,
					description,
					status,
					priority,
					estimatedMinutes,
					dueAt,
				],
			);

			const task = await first<TaskRow>(
				env.DB,
				"SELECT * FROM tasks WHERE id = ?",
				[id],
			);

			return json(task, 201);
		} catch (cause) {
			const message =
				cause instanceof Error ? cause.message : "Invalid request";

			return error(message);
		}
	}

	if (request.method === "PATCH") {
		if (!id || id === "tasks") {
			return error("Task ID is required");
		}

		try {
			const body = await readJson(request);

			const existing = await first<TaskRow>(
				env.DB,
				"SELECT * FROM tasks WHERE id = ?",
				[id],
			);

			if (!existing) {
				return notFound("Task not found");
			}

			const title =
				body.title === undefined
					? existing.title
					: requiredString(body.title, "title", 200);

			const description =
				body.description === undefined
					? existing.description
					: optionalString(body.description, 2000);

			const status =
				body.status === undefined
					? existing.status
					: requiredString(body.status, "status", 30);

			const priority =
				body.priority === undefined
					? existing.priority
					: optionalNumber(body.priority);

			const estimatedMinutes =
				body.estimatedMinutes === undefined
					? existing.estimated_minutes
					: optionalNumber(body.estimatedMinutes);

			const actualMinutes =
				body.actualMinutes === undefined
					? existing.actual_minutes
					: optionalNumber(body.actualMinutes) ?? 0;

			const dueAt =
				body.dueAt === undefined
					? existing.due_at
					: optionalDate(body.dueAt);

			const completedAt =
				status === "completed"
					? existing.completed_at ?? new Date().toISOString()
					: null;

			await run(
				env.DB,
				`UPDATE tasks
				 SET title = ?,
				     description = ?,
				     status = ?,
				     priority = ?,
				     estimated_minutes = ?,
				     actual_minutes = ?,
				     due_at = ?,
				     completed_at = ?,
				     updated_at = datetime('now')
				 WHERE id = ?`,
				[
					title,
					description,
					status,
					priority,
					estimatedMinutes,
					actualMinutes,
					dueAt,
					completedAt,
					id,
				],
			);

			const task = await first<TaskRow>(
				env.DB,
				"SELECT * FROM tasks WHERE id = ?",
				[id],
			);

			return json(task);
		} catch (cause) {
			const message =
				cause instanceof Error ? cause.message : "Invalid request";

			return error(message);
		}
	}

	if (request.method === "DELETE") {
		if (!id || id === "tasks") {
			return error("Task ID is required");
		}

		const result = await run(
			env.DB,
			"DELETE FROM tasks WHERE id = ?",
			[id],
		);

		if (result.meta.changes === 0) {
			return notFound("Task not found");
		}

		return json({ ok: true });
	}

	return methodNotAllowed(["GET", "POST", "PATCH", "DELETE"]);
}
