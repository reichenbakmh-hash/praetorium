export function requiredString(
	value: unknown,
	field: string,
	maxLength = 500,
): string {
	if (typeof value !== "string") {
		throw new Error(`${field} must be a string`);
	}

	const result = value.trim();

	if (!result) {
		throw new Error(`${field} is required`);
	}

	if (result.length > maxLength) {
		throw new Error(`${field} is too long`);
	}

	return result;
}

export function optionalString(
	value: unknown,
	maxLength = 500,
): string | null {
	if (value === null || value === undefined || value === "") {
		return null;
	}

	if (typeof value !== "string") {
		throw new Error("Expected a string");
	}

	const result = value.trim();

	if (result.length > maxLength) {
		throw new Error("Value is too long");
	}

	return result || null;
}

export function optionalNumber(value: unknown): number | null {
	if (value === null || value === undefined || value === "") {
		return null;
	}

	const number = Number(value);

	if (!Number.isFinite(number)) {
		throw new Error("Expected a valid number");
	}

	return number;
}

export function optionalDate(value: unknown): string | null {
	if (value === null || value === undefined || value === "") {
		return null;
	}

	if (typeof value !== "string") {
		throw new Error("Expected an ISO date string");
	}

	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		throw new Error("Invalid date");
	}

	return date.toISOString();
}

export async function readJson(
	request: Request,
): Promise<Record<string, unknown>> {
	const body: unknown = await request.json();

	if (!body || typeof body !== "object" || Array.isArray(body)) {
		throw new Error("Request body must be a JSON object");
	}

	return body as Record<string, unknown>;
}
