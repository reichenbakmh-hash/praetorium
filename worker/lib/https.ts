export function json(
	data: unknown,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			...headers,
		},
	});
}

export function error(message: string, status = 400): Response {
	return json(
		{
			ok: false,
			error: message,
		},
		status,
	);
}

export async function readJson<T>(request: Request): Promise<T> {
	try {
		return (await request.json()) as T;
	} catch {
		throw new Error("Invalid JSON body");
	}
}

export function methodNotAllowed(
	allowed: string[],
): Response {
	return new Response(
		JSON.stringify({
			ok: false,
			error: "Method not allowed",
		}),
		{
			status: 405,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Allow: allowed.join(", "),
			},
		},
	);
}

export function notFound(message = "Not found"): Response {
	return error(message, 404);
}
