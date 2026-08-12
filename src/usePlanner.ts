import { useMemo, useState } from "react";
import {
	INITIAL_ITEMS,
	INITIAL_REVIEWS,
	type EntityLevel,
	type PlannerItem,
	type ReviewLog,
	type Status,
} from "./data";

const STORAGE = "praetorium-state-v1";

interface Store {
	items: PlannerItem[];
	reviews: ReviewLog[];
}

function load(): Store {
	try {
		const raw = localStorage.getItem(STORAGE);

		if (raw) {
			return JSON.parse(raw) as Store;
		}
	} catch {
		// Ignore invalid local data and restore defaults.
	}

	return {
		items: INITIAL_ITEMS,
		reviews: INITIAL_REVIEWS,
	};
}

export function usePlanner() {
	const [store, setStore] = useState<Store>(() => load());

	const persist = (next: Store) => {
		setStore(next);
		localStorage.setItem(STORAGE, JSON.stringify(next));
	};

	const toggleDone = (id: string) => {
		const next: Store = {
			...store,
			items: store.items.map((item) =>
				item.id === id
					? {
							...item,
							status:
								item.status === "done"
									? ("active" as Status)
									: ("done" as Status),
							progress:
								item.status === "done"
									? Math.min(item.progress, 90)
									: 100,
						}
					: item,
			),
		};

		persist(next);
	};

	const addItem = (
		input: Pick<
			PlannerItem,
			| "title"
			| "level"
			| "priority"
			| "dueDate"
			| "estimateMinutes"
			| "parentId"
			| "notes"
		>,
	) => {
		const id = `${input.level}-${Date.now()}`;

		const item: PlannerItem = {
			id,
			title: input.title,
			level: input.level,
			status: "planned",
			priority: input.priority,
			dueDate: input.dueDate,
			startDate: new Date().toISOString().slice(0, 10),
			estimateMinutes: input.estimateMinutes,
			progress: 0,
			parentId: input.parentId,
			notes: input.notes,
			tags: [],
		};

		persist({
			...store,
			items: [item, ...store.items],
		});
	};

	const updateProgress = (id: string, progress: number) => {
		persist({
			...store,
			items: store.items.map((item) =>
				item.id === id
					? {
							...item,
							progress: Math.max(0, Math.min(100, progress)),
							status:
								progress >= 100
									? "done"
									: item.status === "done"
										? "active"
										: item.status,
						}
					: item,
			),
		});
	};

	const addReview = (review: Omit<ReviewLog, "id">) => {
		persist({
			...store,
			reviews: [
				{
					...review,
					id: `r-${Date.now()}`,
				},
				...store.reviews,
			],
		});
	};

	const stats = useMemo(() => {
		const total = store.items.length;

		const done = store.items.filter(
			(item) => item.status === "done",
		).length;

		const active = store.items.filter(
			(item) => item.status === "active",
		).length;

		const today = new Date().toISOString().slice(0, 10);

		const overdue = store.items.filter(
			(item) =>
				item.status !== "done" &&
				item.dueDate < today,
		).length;

		const dueToday = store.items.filter(
			(item) =>
				item.status !== "done" &&
				item.dueDate === today,
		).length;

		return {
			total,
			done,
			active,
			overdue,
			dueToday,
			completion: total
				? Math.round((done / total) * 100)
				: 0,
		};
	}, [store.items]);

	const childrenOf = (id: string) =>
		store.items.filter((item) => item.parentId === id);

	const roots = (level: EntityLevel) =>
		store.items.filter(
			(item) =>
				item.level === level &&
				!item.parentId,
		);

	return {
		...store,
		stats,
		childrenOf,
		roots,
		toggleDone,
		addItem,
		updateProgress,
		addReview,
	};
}
