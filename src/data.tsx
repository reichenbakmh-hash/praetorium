export type EntityLevel = "task" | "goal" | "mission" | "campaign";

export type Status = "planned" | "active" | "done" | "blocked";

export interface PlannerItem {
	id: string;
	title: string;
	level: EntityLevel;
	status: Status;
	priority: "low" | "normal" | "high" | "critical";
	parentId?: string;
	notes: string;
	startDate: string;
	dueDate: string;
	estimateMinutes: number;
	progress: number;
	tags: string[];
}

export interface ReviewLog {
	id: string;
	date: string;
	good: string[];
	improve: string[];
	score: number;
}

const iso = (date: Date) => date.toISOString().slice(0, 10);

const addDays = (days: number) => {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return iso(date);
};

export const INITIAL_ITEMS: PlannerItem[] = [
	{
		id: "cmp-01",
		title: "PRAETORIAN BUILD // Q3",
		level: "campaign",
		status: "active",
		priority: "critical",
		notes: "Campagne stratégique : transformer l'intention en exécution.",
		startDate: iso(new Date()),
		dueDate: addDays(45),
		estimateMinutes: 10800,
		progress: 42,
		tags: ["strategy", "build"],
	},
	{
		id: "mis-01",
		title: "SHIP PRAETORIUM MVP",
		level: "mission",
		status: "active",
		priority: "high",
		parentId: "cmp-01",
		notes: "Livrer le socle PWA et le journal de pilotage.",
		startDate: iso(new Date()),
		dueDate: addDays(12),
		estimateMinutes: 1800,
		progress: 61,
		tags: ["product"],
	},
	{
		id: "goal-01",
		title: "FINALISER LE CORE PLANNER",
		level: "goal",
		status: "active",
		priority: "high",
		parentId: "mis-01",
		notes: "Avoir une boucle quotidienne utilisable sans friction.",
		startDate: iso(new Date()),
		dueDate: addDays(5),
		estimateMinutes: 420,
		progress: 74,
		tags: ["daily"],
	},
	{
		id: "task-01",
		title: "DESIGNER LA VUE DAILY",
		level: "task",
		status: "done",
		priority: "normal",
		parentId: "goal-01",
		notes: "Dashboard principal avec échéances, charge et focus.",
		startDate: iso(new Date()),
		dueDate: addDays(-1),
		estimateMinutes: 90,
		progress: 100,
		tags: ["ui"],
	},
	{
		id: "task-02",
		title: "AJOUTER LA SAISIE RAPIDE",
		level: "task",
		status: "active",
		priority: "normal",
		parentId: "goal-01",
		notes: "Transformer un item en but/mission/campagne.",
		startDate: iso(new Date()),
		dueDate: addDays(1),
		estimateMinutes: 45,
		progress: 35,
		tags: ["ux"],
	},
	{
		id: "task-03",
		title: "TESTER LE MODE OFFLINE",
		level: "task",
		status: "planned",
		priority: "low",
		parentId: "goal-01",
		notes: "Vérifier cache applicatif et restauration locale.",
		startDate: iso(new Date()),
		dueDate: addDays(3),
		estimateMinutes: 50,
		progress: 0,
		tags: ["pwa"],
	},
];

export const INITIAL_REVIEWS: ReviewLog[] = [
	{
		id: "r-01",
		date: addDays(-1),
		good: [
			"A tenu le focus sur 1 mission",
			"3 tâches critiques terminées",
		],
		improve: [
			"Prévoir des marges pour les retards",
		],
		score: 82,
	},
	{
		id: "r-02",
		date: iso(new Date()),
		good: [
			"Décomposition claire des objectifs",
		],
		improve: [
			"Réduire le multitâche",
			"Fermer les tâches avant d'ouvrir une nouvelle piste",
		],
		score: 74,
	},
];
