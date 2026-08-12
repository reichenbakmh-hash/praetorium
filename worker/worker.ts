import { tasksApi } from "./api/tasks";
import { error, json } from "./lib/http";

export default {
	async fetch(
		request: Request,
		env: Env,
	): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === "/api/health") {
			return json({
				ok: true,
				service: "praetorium",
				timestamp: new Date().toISOString(),
			});
		}

		if (
			url.pathname === "/api/tasks" ||
			url.pathname.startsWith("/api/tasks/")
		) {
			return tasksApi(request, env);
		}

		if (url.pathname.startsWith("/api/")) {
			return error(
				"API endpoint not found",
				404,
				"NOT_FOUND",
			);
		}

		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Env>;
