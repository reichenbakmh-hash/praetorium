export function json(
	data: unknown,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return new Response(
		JSON.stringify(data),
		{
			status,
			headers: {
				"Content-Type":
					"application/json; charset=utf-8",
				"Cache-Control":
					"no-store",
				...headers,
			},
		},
	);
}

export function error(
	message: string,
	status = 400,
	code = "BAD_REQUEST",
): Response {
	return json(
		{
			ok: false,
			error: {
				code,
				message,
			},
		},
		status,
	);
}

export function methodNotAllowed(
	allowed: string[],
): Response {
	return error(
		`Method not allowed. Expected: ${allowed.join(", ")}`,
		405,
		"METHOD_NOT_ALLOWED",
	);
}

export function notFound(
	message = "Resource not found",
): Response {
	return error(
		message,
		404,
		"NOT_FOUND",
	);
}
