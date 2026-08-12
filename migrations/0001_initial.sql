PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY,
	email TEXT UNIQUE,
	display_name TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS campaigns (
	id TEXT PRIMARY KEY,
	user_id TEXT,
	title TEXT NOT NULL,
	description TEXT,
	status TEXT NOT NULL DEFAULT 'active',
	priority INTEGER NOT NULL DEFAULT 0,
	starts_at TEXT,
	due_at TEXT,
	progress INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),

	FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE CASCADE,

	CHECK (progress >= 0 AND progress <= 100)
);

CREATE TABLE IF NOT EXISTS missions (
	id TEXT PRIMARY KEY,
	campaign_id TEXT,
	user_id TEXT,
	title TEXT NOT NULL,
	description TEXT,
	status TEXT NOT NULL DEFAULT 'planned',
	priority INTEGER NOT NULL DEFAULT 0,
	starts_at TEXT,
	due_at TEXT,
	progress INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),

	FOREIGN KEY (campaign_id)
		REFERENCES campaigns(id)
		ON DELETE CASCADE,

	FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE CASCADE,

	CHECK (progress >= 0 AND progress <= 100)
);

CREATE TABLE IF NOT EXISTS goals (
	id TEXT PRIMARY KEY,
	mission_id TEXT,
	user_id TEXT,
	title TEXT NOT NULL,
	description TEXT,
	status TEXT NOT NULL DEFAULT 'planned',
	priority INTEGER NOT NULL DEFAULT 0,
	starts_at TEXT,
	due_at TEXT,
	progress INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),

	FOREIGN KEY (mission_id)
		REFERENCES missions(id)
		ON DELETE CASCADE,

	FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE CASCADE,

	CHECK (progress >= 0 AND progress <= 100)
);

CREATE TABLE IF NOT EXISTS tasks (
	id TEXT PRIMARY KEY,
	goal_id TEXT,
	user_id TEXT,
	title TEXT NOT NULL,
	description TEXT,
	status TEXT NOT NULL DEFAULT 'todo',
	priority INTEGER NOT NULL DEFAULT 0,
	estimated_minutes INTEGER,
	actual_minutes INTEGER NOT NULL DEFAULT 0,
	due_at TEXT,
	completed_at TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),

	FOREIGN KEY (goal_id)
		REFERENCES goals(id)
		ON DELETE CASCADE,

	FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS deadlines (
	id TEXT PRIMARY KEY,
	user_id TEXT,

	campaign_id TEXT,
	mission_id TEXT,
	goal_id TEXT,
	task_id TEXT,

	title TEXT NOT NULL,
	description TEXT,
	due_at TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'open',

	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),

	FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE CASCADE,

	FOREIGN KEY (campaign_id)
		REFERENCES campaigns(id)
		ON DELETE CASCADE,

	FOREIGN KEY (mission_id)
		REFERENCES missions(id)
		ON DELETE CASCADE,

	FOREIGN KEY (goal_id)
		REFERENCES goals(id)
		ON DELETE CASCADE,

	FOREIGN KEY (task_id)
		REFERENCES tasks(id)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS time_entries (
	id TEXT PRIMARY KEY,
	user_id TEXT,

	task_id TEXT,
	goal_id TEXT,
	mission_id TEXT,
	campaign_id TEXT,

	started_at TEXT NOT NULL,
	ended_at TEXT,
	duration_minutes INTEGER NOT NULL DEFAULT 0,

	note TEXT,

	created_at TEXT NOT NULL DEFAULT (datetime('now')),

	FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE CASCADE,

	FOREIGN KEY (task_id)
		REFERENCES tasks(id)
		ON DELETE CASCADE,

	FOREIGN KEY (goal_id)
		REFERENCES goals(id)
		ON DELETE CASCADE,

	FOREIGN KEY (mission_id)
		REFERENCES missions(id)
		ON DELETE CASCADE,

	FOREIGN KEY (campaign_id)
		REFERENCES campaigns(id)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_reviews (
	id TEXT PRIMARY KEY,
	user_id TEXT,

	review_date TEXT NOT NULL,

	score INTEGER NOT NULL DEFAULT 0,

	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	updated_at TEXT NOT NULL DEFAULT (datetime('now')),

	UNIQUE (user_id, review_date),

	FOREIGN KEY (user_id)
		REFERENCES users(id)
		ON DELETE CASCADE,

	CHECK (score >= 0 AND score <= 100)
);

CREATE TABLE IF NOT EXISTS daily_review_good (
	id TEXT PRIMARY KEY,
	review_id TEXT NOT NULL,
	content TEXT NOT NULL,
	position INTEGER NOT NULL DEFAULT 0,

	FOREIGN KEY (review_id)
		REFERENCES daily_reviews(id)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_review_improve (
	id TEXT PRIMARY KEY,
	review_id TEXT NOT NULL,
	content TEXT NOT NULL,
	position INTEGER NOT NULL DEFAULT 0,

	FOREIGN KEY (review_id)
		REFERENCES daily_reviews(id)
		ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_campaigns_user
	ON campaigns(user_id);

CREATE INDEX IF NOT EXISTS idx_missions_campaign
	ON missions(campaign_id);

CREATE INDEX IF NOT EXISTS idx_missions_user
	ON missions(user_id);

CREATE INDEX IF NOT EXISTS idx_goals_mission
	ON goals(mission_id);

CREATE INDEX IF NOT EXISTS idx_goals_user
	ON goals(user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_goal
	ON tasks(goal_id);

CREATE INDEX IF NOT EXISTS idx_tasks_user
	ON tasks(user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_due
	ON tasks(due_at);

CREATE INDEX IF NOT EXISTS idx_deadlines_due
	ON deadlines(due_at);

CREATE INDEX IF NOT EXISTS idx_deadlines_task
	ON deadlines(task_id);

CREATE INDEX IF NOT EXISTS idx_time_entries_task
	ON time_entries(task_id);

CREATE INDEX IF NOT EXISTS idx_reviews_date
	ON daily_reviews(review_date);
