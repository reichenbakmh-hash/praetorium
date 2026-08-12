import type {
	ButtonHTMLAttributes,
	InputHTMLAttributes,
	ReactNode,
	TextareaHTMLAttributes,
} from "react";
import { useEffect, useState } from "react";

export type StatusKind =
	| "ok"
	| "run"
	| "warn"
	| "err";

const statusText: Record<StatusKind, string> = {
	ok: "[OK]",
	run: "[RUN]",
	warn: "[WARN]",
	err: "[ERR]",
};

export function StatusBadge({
	kind,
	pulse = false,
}: {
	kind: StatusKind;
	pulse?: boolean;
}) {
	const tone =
		kind === "err"
			? "text-error"
			: kind === "warn"
				? "text-secondary"
				: "text-primary";

	return (
		<span
			className={`${tone} ${
				pulse
					? "[animation:var(--animate-blink)]"
					: ""
			} text-2xs font-bold`}
		>
			{statusText[kind]}
		</span>
	);
}

export function Cursor({
	char = "_",
}: {
	char?: string;
}) {
	return (
		<span
			aria-hidden
			className="inline-block text-primary [animation:var(--animate-blink)]"
		>
			{char}
		</span>
	);
}

export function Divider({
	label,
	glyph = "─",
	className = "",
}: {
	label?: string;
	glyph?: string;
	className?: string;
}) {
	return (
		<div
			className={`flex items-center gap-2 text-muted ${className}`}
			aria-hidden
		>
			<span className="truncate">
				{glyph.repeat(28)}
			</span>

			{label ? (
				<span className="shrink-0 text-2xs uppercase text-dim">
					[{label}]
				</span>
			) : null}

			<span className="truncate">
				{glyph.repeat(28)}
			</span>
		</div>
	);
}

export function BracketButton({
	children,
	tone = "primary",
	className = "",
	...props
}: {
	children: ReactNode;
	tone?: "primary" | "secondary";
	className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
	const color =
		tone === "secondary"
			? "text-secondary hover:bg-secondary"
			: "text-primary hover:bg-primary";

	return (
		<button
			{...props}
			className={`border border-current px-3 py-1.5 text-xs font-bold tracking-[.12em] transition-colors hover:text-bg disabled:cursor-not-allowed disabled:opacity-40 ${color} ${className}`}
		>
			[ {children} ]
		</button>
	);
}

export function Window({
	title,
	flags,
	children,
	className = "",
	bodyClassName = "",
	id,
}: {
	title: string;
	flags?: ReactNode;
	children: ReactNode;
	className?: string;
	bodyClassName?: string;
	id?: string;
}) {
	return (
		<section
			id={id}
			className={`border border-border bg-bg/70 ${className}`}
		>
			<div className="flex items-center justify-between border-b border-border bg-primary px-2 py-1 text-2xs font-bold tracking-[.12em] text-bg">
				<span>+-- {title} --+</span>
				<span>{flags}</span>
			</div>

			<div className={`p-3 ${bodyClassName}`}>
				{children}
			</div>
		</section>
	);
}

export function AsciiBar({
	label,
	value,
}: {
	label: string;
	value: number;
}) {
	const segments = 20;
	const filled = Math.round(
		(value / 100) * segments,
	);

	const bar = `${"|".repeat(filled)}${".".repeat(
		segments - filled,
	)}`;

	return (
		<div>
			<div className="mb-1 flex justify-between gap-2 text-2xs">
				<span className="text-dim">{label}</span>
				<span className="text-primary">
					{value}%
				</span>
			</div>

			<div className="border border-muted px-1 py-0.5 text-xs tracking-[.14em] text-primary">
				[{bar}]
			</div>
		</div>
	);
}

export function PromptInput({
	prompt,
	label,
	value,
	onChange,
	placeholder,
	tone = "primary",
	...props
}: {
	prompt: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	tone?: "primary" | "secondary";
} & InputHTMLAttributes<HTMLInputElement>) {
	return (
		<label className="flex items-center gap-2 text-xs">
			<span
				className={
					tone === "secondary"
						? "text-secondary"
						: "text-primary"
				}
			>
				{prompt}
			</span>

			<span className="sr-only">{label}</span>

			<span className="relative min-w-0 flex-1">
				<input
					{...props}
					value={value}
					onChange={(event) =>
						onChange(event.target.value)
					}
					placeholder={placeholder}
					className="w-full border-0 border-b border-dashed border-muted bg-transparent py-1 text-primary placeholder:text-muted focus:border-primary focus:outline-none"
				/>

				<span className="pointer-events-none absolute right-0 top-1 text-primary [animation:var(--animate-blink)]">
					█
				</span>
			</span>
		</label>
	);
}

export function PromptTextarea({
	prompt,
	label,
	value,
	onChange,
	...props
}: {
	prompt: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
} & TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return (
		<label className="flex items-start gap-2 text-xs">
			<span className="shrink-0 text-secondary">
				{prompt}
			</span>

			<span className="sr-only">{label}</span>

			<textarea
				{...props}
				value={value}
				onChange={(event) =>
					onChange(event.target.value)
				}
				className="min-h-24 w-full resize-y border border-dashed border-muted bg-transparent p-2 text-primary placeholder:text-muted focus:border-primary focus:outline-none"
			/>
		</label>
	);
}

export function Typewriter({
	text,
	speed = 32,
	onDone,
	cursor = false,
}: {
	text: string;
	speed?: number;
	onDone?: () => void;
	cursor?: boolean;
}) {
	const [output, setOutput] = useState("");

	useEffect(() => {
		let index = 0;

		const timer = window.setInterval(() => {
			index += 1;

			setOutput(text.slice(0, index));

			if (index >= text.length) {
				window.clearInterval(timer);
				onDone?.();
			}
		}, speed);

		return () =>
			window.clearInterval(timer);
	}, [text, speed, onDone]);

	return (
		<>
			{output}
			{cursor ? <Cursor /> : null}
		</>
	);
}
