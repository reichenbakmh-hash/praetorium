import { readFile } from "node:fs/promises";

const required = [
	"index.html",
	"src/main.tsx",
	"src/App.tsx",
	"src/index.css",
	"src/usePlanner.ts",
	"src/data.ts",
	"public/manifest.webmanifest",
	"public/sw.js",
];

for (const file of required) {
	await readFile(file, "utf8");
}

console.log(
	"PRAETORIUM VERIFY // [OK] core files present",
);
