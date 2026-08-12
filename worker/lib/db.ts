export interface QueryOptions {
	params?: unknown[];
}

export async function query<T>(
	db: D1Database,
	sql: string,
	params: unknown[] = [],
): Promise<T[]> {
	const result = await db.prepare(sql).bind(...params).all<T>();
	return result.results;
}

export async function first<T>(
	db: D1Database,
	sql: string,
	params: unknown[] = [],
): Promise<T | null> {
	return db.prepare(sql).bind(...params).first<T>();
}

export async function run(
	db: D1Database,
	sql: string,
	params: unknown[] = [],
): Promise<D1Result> {
	return db.prepare(sql).bind(...params).run();
}
