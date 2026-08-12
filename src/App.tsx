import { useEffect, useMemo, useState } from "react";
import {
	CalendarClock,
	Check,
	ChevronRight,
	Flag,
	Target,
	Timer,
	Trophy,
} from "lucide-react";
import {
	AsciiBar,
	BracketButton,
	Cursor,
	Divider,
	PromptInput,
	PromptTextarea,
	StatusBadge,
	Typewriter,
	Window,
} from "./design-system";
import type {
	EntityLevel,
	PlannerItem,
} from "./data";
import { usePlanner } from "./usePlanner";

const ICON =
	"h-3.5 w-3.5 shrink-0 text-primary [stroke-width:2]";

const today = () =>
	new Date().toISOString().slice(0, 10);

const fmt = (date: string) =>
	new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "2-digit",
	}).format(new Date(`${date}T12:00:00`));

const levelLabel: Record<EntityLevel, string> = {
	task: "TÂCHE",
	goal: "BUT",
	mission: "MISSION",
	campaign: "CAMPAGNE",
};

function useClock() {
	const [now, setNow] = useState(
		() => new Date(),
	);

	useEffect(() => {
		const id = window.setInterval(
			() => setNow(new Date()),
			1000,
		);

		return () =>
			window.clearInterval(id);
	}, []);

	return now;
}

function StatusBar({
	stats,
}: {
	stats: ReturnType<
		typeof usePlanner
	>["stats"];
}) {
	const now = useClock();

	const time = now.toLocaleTimeString(
		"fr-FR",
		{
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		},
	);

	return (
		<div className="sticky top-0 z-40 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border bg-bg/95 px-3 py-1.5 text-2xs backdrop-blur sm:px-5">
			<span className="font-bold tracking-[.16em] text-primary glow">
				PRAETORIUM // COMMAND DECK
			</span>

			<span className="hidden text-dim sm:inline">
				v1.0.0
			</span>

			<span className="ml-auto text-dim">
				{stats.active} ACTIVE
			</span>

			<span className="text-secondary glow-amber">
				{stats.overdue} OVERDUE
			</span>

			<span className="tabular-nums text-secondary">
				{time}
			</span>

			<StatusBadge kind="ok" />
		</div>
	);
}

function Hero() {
	return (
		<header className="relative px-3 pt-9 pb-8 sm:px-5 sm:pt-12">
			<pre className="mb-5 text-[.55rem] leading-[.8] text-primary glow sm:text-xs">
				{String.raw`
██████╗ ██████╗  █████╗ ███████╗████████╗ ██████╗ ██████╗ ██╗██╗   ██╗███╗   ███╗
██╔══██╗██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██║██║   ██║████╗ ████║
██████╔╝██████╔╝███████║█████╗     ██║   ██║   ██║██████╔╝██║██║   ██║██╔████╔██║
██╔═══╝ ██╔══██╗██╔══██║██╔══╝     ██║   ██║   ██║██╔══██╗██║██║   ██║██║╚██╔╝██║
██║     ██║  ██║██║  ██║██║        ██║   ╚██████╔╝██║  ██║██║╚██████╔╝██║ ╚═╝ ██║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝        ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝     ╚═╝`}
			</pre>

			<p className="mb-3 text-xs tracking-[.18em] text-dim">
				$ ./praetorium --boot --profile=phosphor
			</p>

			<h1 className="max-w-5xl text-2xl font-bold uppercase leading-[1.05] tracking-tight text-primary glow sm:text-3xl">
				<Typewriter
					text="DISCIPLINE INTO DATA."
					speed={36}
				/>

				<br />

				<span className="text-secondary glow-amber">
					<Typewriter
						text="FROM TASK TO CAMPAIGN."
						speed={30}
					/>

					<Cursor />
				</span>
			</h1>

			<p className="mt-5 max-w-3xl text-sm leading-relaxed text-dim sm:text-base">
				Transforme une{" "}
				<span className="text-primary">
					tâche
				</span>{" "}
				en{" "}
				<span className="text-primary">
					but
				</span>
				, un but en{" "}
				<span className="text-primary">
					mission
				</span>
				, une mission en{" "}
				<span className="text-secondary">
					campagne
				</span>
				. Chaque niveau porte sa deadline,
				sa durée et sa preuve d'exécution.
			</p>
		</header>
	);
}

function StatWindow({
	stats,
}: {
	stats: ReturnType<
		typeof usePlanner
	>["stats"];
}) {
	return (
		<Window
			title="daily.telemetry"
			flags="--watch"
		>
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{[
					["DONE", stats.done],
					["ACTIVE", stats.active],
					[
						"DUE TODAY",
						stats.dueToday,
					],
					[
						"OVERDUE",
						stats.overdue,
					],
				].map(([label, value]) => (
					<div
						key={label}
						className="border border-dashed border-muted p-2"
					>
						<div className="text-2xs text-dim">
							{label}
						</div>

						<div className="mt-1 text-xl text-primary glow">
							{value}
						</div>
					</div>
				))}
			</div>

			<div className="mt-4">
				<AsciiBar
					label="EXECUTION // GLOBAL"
					value={stats.completion}
				/>
			</div>
		</Window>
	);
}

function DeadlineRow({
	item,
	onToggle,
	onProgress,
}: {
	item: PlannerItem;
	onToggle: (id: string) => void;
	onProgress: (
		id: string,
		value: number,
	) => void;
}) {
	const overdue =
		item.status !== "done" &&
		item.dueDate < today();

	const level = levelLabel[item.level];

	return (
		<div className="group border-b border-dashed border-muted/30 py-2 last:border-0">
			<div className="grid grid-cols-[auto_1fr_auto] items-start gap-2">
				<button
					type="button"
					aria-label={`Terminer ${item.title}`}
					onClick={() =>
						onToggle(item.id)
					}
					className={`mt-0.5 border p-0.5 ${
						item.status === "done"
							? "border-primary bg-primary text-bg"
							: "border-muted text-muted hover:border-primary hover:text-primary"
					}`}
				>
					<Check className="h-3 w-3" />
				</button>

				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<span
							className={`text-[.65rem] font-bold ${
								item.level === "campaign"
									? "text-secondary"
									: item.level === "mission"
										? "text-primary"
										: "text-dim"
							}`}
						>
							{level}
						</span>

						<span
							className={`truncate text-sm ${
								item.status === "done"
									? "text-dim line-through"
									: "text-primary"
							}`}
						>
							{item.title}
						</span>
					</div>

					<div className="mt-1 flex flex-wrap gap-x-3 text-2xs text-dim">
						<span
							className={
								overdue
									? "text-error glow-error"
									: "text-dim"
							}
						>
							due {fmt(item.dueDate)}
						</span>

						<span>
							eta{" "}
							{Math.round(
								item.estimateMinutes /
									60,
							)}
							h{" "}
							{item.estimateMinutes %
								60}
							m
						</span>

						<span>
							prio {item.priority}
						</span>
					</div>
				</div>

				<div className="text-right text-xs text-primary">
					{item.progress}%
				</div>
			</div>

			<div className="mt-2 flex items-center gap-2 pl-6">
				<input
					aria-label={`Progression ${item.title}`}
					type="range"
					min="0"
					max="100"
					value={item.progress}
					onChange={(event) =>
						onProgress(
							item.id,
							Number(
								event.target.value,
							),
						)
					}
					className="w-full accent-[var(--color-primary)]"
				/>

				<ChevronRight className="h-3 w-3 text-muted" />
			</div>
		</div>
	);
}

function DailyWindow({
	items,
	onToggle,
	onProgress,
}: {
	items: PlannerItem[];
	onToggle: (id: string) => void;
	onProgress: (
		id: string,
		value: number,
	) => void;
}) {
	const due = [...items]
		.filter(
			(item) => item.status !== "done",
		)
		.sort((a, b) =>
			a.dueDate.localeCompare(
				b.dueDate,
			),
		)
		.slice(0, 8);

	return (
		<Window
			title="daily.execute"
			flags={
				<span className="flex items-center gap-1">
					<CalendarClock
						className={ICON}
					/>
					TODAY
				</span>
			}
		>
			<div className="mb-3 flex items-center justify-between">
				<span className="text-xs text-dim">
					~ dispatch queue
				</span>

				<span className="text-2xs text-secondary">
					deadline-first
				</span>
			</div>

			{due.map((item) => (
				<DeadlineRow
					key={item.id}
					item={item}
					onToggle={onToggle}
					onProgress={onProgress}
				/>
			))}
		</Window>
	);
}

function Hierarchy({
	items,
}: {
	items: PlannerItem[];
}) {
	const campaigns = items.filter(
		(item) => item.level === "campaign",
	);

	return (
		<Window
			title="command.hierarchy"
			flags="--tree"
		>
			<div className="font-mono text-xs">
				{campaigns.map((campaign) => {
					const missions = items.filter(
						(item) =>
							item.parentId ===
							campaign.id,
					);

					return (
						<div
							key={campaign.id}
							className="mb-3"
						>
							<div className="text-secondary">
								└─{" "}
								{campaign.title}{" "}
								<span className="text-dim">
									[
									{
										campaign.progress
									}
									%]
								</span>
							</div>

							{missions.map(
								(mission) => {
									const goals =
										items.filter(
											(item) =>
												item.parentId ===
												mission.id,
										);

									return (
										<div
											key={
												mission.id
											}
											className="ml-4"
										>
											<div className="text-primary">
												└─{" "}
												{
													mission.title
												}{" "}
												<span className="text-dim">
													[
													{
														mission.progress
													}
													%]
												</span>
											</div>

											{goals.map(
												(goal) => (
													<div
														key={
															goal.id
														}
														className="ml-4 text-dim"
													>
														└─{" "}
														<span className="text-primary">
															{
																goal.title
															}
														</span>{" "}
														[
														{
															goal.progress
														}
														%]

														{items
															.filter(
																(item) =>
																	item.parentId ===
																	goal.id,
															)
															.map(
																(
																	task,
																) => (
																	<div
																		key={
																			task.id
																		}
																		className="ml-4 text-muted"
																	>
																		└─{" "}
																		{task.status ===
																		"done"
																			? "✓"
																			: "·"}{" "}
																		{
																			task.title
																		}
																	</div>
																),
															)}
													</div>
												),
											)}
										</div>
									);
								},
							)}
						</div>
					);
				})}
			</div>
		</Window>
	);
}

function AddWindow({
	onAdd,
}: {
	onAdd: (
		input: Parameters<
			ReturnType<typeof usePlanner>["addItem"]
		>[0],
	) => void;
}) {
	const [level, setLevel] =
		useState<EntityLevel>("task");

	const [title, setTitle] =
		useState("");

	const [dueDate, setDueDate] =
		useState(today());

	const [estimateMinutes, setEstimateMinutes] =
		useState("30");

	const [priority, setPriority] =
		useState<
			PlannerItem["priority"]
		>("normal");

	const [notes, setNotes] =
		useState("");

	return (
		<Window
			title="initiate.new"
			flags="--create"
		>
			<div className="flex flex-col gap-3">
				<PromptInput
					prompt=">"
					label="name"
					value={title}
					onChange={setTitle}
					placeholder="new objective..."
				/>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<label className="text-2xs text-dim">
						LEVEL

						<select
							value={level}
							onChange={(event) =>
								setLevel(
									event.target.value as EntityLevel,
								)
							}
							className="mt-1 w-full border border-dashed border-muted bg-bg p-2 text-xs text-primary"
						>
							<option value="task">
								TASK // TÂCHE
							</option>

							<option value="goal">
								GOAL // BUT
							</option>

							<option value="mission">
								MISSION
							</option>

							<option value="campaign">
								CAMPAIGN
							</option>
						</select>
					</label>

					<label className="text-2xs text-dim">
						DEADLINE

						<input
							type="date"
							value={dueDate}
							onChange={(event) =>
								setDueDate(
									event.target.value,
								)
							}
							className="mt-1 w-full border border-dashed border-muted bg-bg p-2 text-xs text-primary"
						/>
					</label>

					<label className="text-2xs text-dim">
						ETA (MIN)

						<input
							type="number"
							min="1"
							value={estimateMinutes}
							onChange={(event) =>
								setEstimateMinutes(
									event.target.value,
								)
							}
							className="mt-1 w-full border border-dashed border-muted bg-bg p-2 text-xs text-primary"
						/>
					</label>

					<label className="text-2xs text-dim">
						PRIORITY

						<select
							value={priority}
							onChange={(event) =>
								setPriority(
									event.target.value as PlannerItem["priority"],
								)
							}
							className="mt-1 w-full border border-dashed border-muted bg-bg p-2 text-xs text-primary"
						>
							<option value="low">
								LOW
							</option>

							<option value="normal">
								NORMAL
							</option>

							<option value="high">
								HIGH
							</option>

							<option value="critical">
								CRITICAL
							</option>
						</select>
					</label>
				</div>

				<PromptTextarea
					prompt=">"
					label="notes"
					value={notes}
					onChange={setNotes}
					placeholder="context / definition of done..."
				/>

				<div className="flex items-center gap-2">
					<BracketButton
						disabled={!title.trim()}
						onClick={() => {
							onAdd({
								title: title.trim(),
								level,
								priority,
								dueDate,
								estimateMinutes:
									Number(
										estimateMinutes,
									) || 30,
								notes,
							});

							setTitle("");
							setNotes("");
						}}
					>
						COMMIT
					</BracketButton>

					<span className="text-2xs text-dim">
						transformations:
						task → goal → mission →
						campaign
					</span>
				</div>
			</div>
		</Window>
	);
}

function ReviewWindow({
	reviews,
	onAddReview,
}: {
	reviews: ReturnType<
		typeof usePlanner
	>["reviews"];

	onAddReview: ReturnType<
		typeof usePlanner
	>["addReview"];
}) {
	const [good, setGood] =
		useState("");

	const [improve, setImprove] =
		useState("");

	const [score, setScore] =
		useState("75");

	return (
		<Window
			title="after.action"
			flags="--review"
		>
			<div className="grid gap-4 lg:grid-cols-2">
				<div>
					<p className="mb-2 text-xs text-dim">
						<span className="text-primary">
							what worked
						</span>{" "}
						// evidence, wins, focus
						kept
					</p>

					<PromptInput
						prompt="+"
						label="good"
						value={good}
						onChange={setGood}
						placeholder="ex: deep work block completed"
					/>

					<div className="mt-4 max-h-28 overflow-auto text-xs">
						{reviews
							.slice(0, 3)
							.map((review) => (
								<div
									key={review.id}
									className="mb-2 text-dim"
								>
									[{review.score}
									/100]{" "}
									{review.good[0]}
								</div>
							))}
					</div>
				</div>

				<div>
					<p className="mb-2 text-xs text-dim">
						<span className="text-secondary">
							what to improve
						</span>{" "}
						// frictions, leaks, next
						correction
					</p>

					<PromptInput
						prompt="-"
						label="improve"
						value={improve}
						onChange={setImprove}
						placeholder="ex: stop opening new missions mid-day"
					/>

					<div className="mt-3 flex items-center gap-3">
						<label className="text-2xs text-dim">
							SCORE

							<input
								value={score}
								onChange={(event) =>
									setScore(
										event.target.value,
									)
								}
								className="w-12 border-b border-muted bg-transparent text-primary"
							/>
						</label>

						<BracketButton
							tone="secondary"
							disabled={
								!good.trim() &&
								!improve.trim()
							}
							onClick={() => {
								onAddReview({
									date: today(),
									good: good
										? [good]
										: [],
									improve: improve
										? [improve]
										: [],
									score:
										Number(score) ||
										0,
								});

								setGood("");
								setImprove("");
							}}
						>
							LOG REVIEW
						</BracketButton>
					</div>
				</div>
			</div>
		</Window>
	);
}

function Footer() {
	return (
		<footer className="px-3 pt-4 pb-10 sm:px-5">
			<Divider
				glyph="═"
				className="mb-4"
			/>

			<div className="flex flex-wrap gap-3 text-2xs text-dim">
				<span>PRAETORIUM</span>
				<span>~/daily</span>
				<span>~/missions</span>
				<span>~/campaigns</span>

				<span className="ml-auto">
					offline-first{" "}
					<span className="text-primary">
						[OK]
					</span>{" "}
					<Cursor />
				</span>
			</div>
		</footer>
	);
}

export default function App() {
	const planner = usePlanner();

	const [showAdd, setShowAdd] =
		useState(true);

	const active = useMemo(
		() =>
			planner.items.filter(
				(item) =>
					item.status !== "done",
			),
		[planner.items],
	);

	return (
		<div className="min-h-screen w-full overflow-x-hidden [animation:var(--animate-flicker)]">
			<div className="mx-auto max-w-7xl">
				<StatusBar stats={planner.stats} />

				<Hero />

				<Divider
					label="live command surface"
					className="px-3 pb-4 sm:px-5"
				/>

				<main className="grid grid-cols-1 gap-3 px-3 sm:px-5 xl:grid-cols-3">
					<div className="space-y-3 xl:col-span-2">
						<StatWindow
							stats={planner.stats}
						/>

						<DailyWindow
							items={active}
							onToggle={
								planner.toggleDone
							}
							onProgress={
								planner.updateProgress
							}
						/>

						<Hierarchy
							items={planner.items}
						/>
					</div>

					<div className="space-y-3">
						<div className="flex justify-end">
							<BracketButton
								onClick={() =>
									setShowAdd(
										(value) =>
											!value,
									)
								}
							>
								{showAdd
									? "HIDE NEW"
									: "NEW ITEM"}
							</BracketButton>
						</div>

						{showAdd ? (
							<AddWindow
								onAdd={
									planner.addItem
								}
							/>
						) : null}

						<Window
							title="planning.principles"
							flags="--help"
						>
							<div className="space-y-2 text-xs text-dim">
								<div>
									<Target
										className={`${ICON} inline mr-2`}
									/>
									<span className="text-primary">
										BUT
									</span>{" "}
									= résultat
									vérifiable
								</div>

								<div>
									<Trophy
										className={`${ICON} inline mr-2`}
									/>
									<span className="text-primary">
										MISSION
									</span>{" "}
									= paquet
									d'objectifs
								</div>

								<div>
									<Flag
										className={`${ICON} inline mr-2`}
									/>
									<span className="text-secondary">
										CAMPAGNE
									</span>{" "}
									= horizon
									stratégique
								</div>

								<div>
									<Timer
										className={`${ICON} inline mr-2`}
									/>
									<span className="text-primary">
										ETA
									</span>{" "}
									= coût
									temporel assumé
								</div>
							</div>
						</Window>
					</div>

					<div className="xl:col-span-3">
						<ReviewWindow
							reviews={
								planner.reviews
							}
							onAddReview={
								planner.addReview
							}
						/>
					</div>
				</main>

				<Footer />
			</div>
		</div>
	);
    }
