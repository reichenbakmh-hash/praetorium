export function json<T>(
	data: T,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return Response.json(data, {
		status,
		headers: {
			"Cache-Control": "no-store",
			...headers,
		},
	});
}

export function error(
	message: string,
	status = 400,
	code = "BAD_REQUEST",
): Response {
	return json(
		{
			error: {
				code,
				message,
			},
		},
		status,
	);
}

export function methodNotAllowed(allowed: string[]): Response {
	return error(
		`Method not allowed. Expected: ${allowed.join(", ")}`,
		405,
		"METHOD_NOT_ALLOWED",
	);
}

export function notFound(message = "Resource not found"): Response {
	return error(message, 404, "NOT_FOUND");
}
