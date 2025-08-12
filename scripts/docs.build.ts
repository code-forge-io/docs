import { execSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import semver from "semver"
import { type DocsConfig, DocsConfigSchema } from "../docs-config/docs.schema"

// tsx scripts/generate-docs.ts --config ./docs.config.ts - remove first 2
const args = process.argv.slice(2)
const configPath = (() => {
	const i = args.findIndex((a) => a === "--config" || a.startsWith("--config="))
	if (i === -1) {
		// biome-ignore lint/suspicious/noConsole: for debuging
		console.error("❌ You must provide --config <path> or --config=<path>")
		process.exit(1)
	}
	const configPath = args[i].includes("=") ? args[i].split("=")[1] : args[i + 1]

	if (!configPath || configPath.startsWith("--")) {
		// biome-ignore lint/suspicious/noConsole: for debuging
		console.error("❌ Missing path after --config")
		process.exit(1)
	}
	return configPath
})()

const ROOT = process.cwd()
const sh = (cmd: string, cwd = ROOT, inherit = false) =>
	execSync(cmd, { cwd, stdio: inherit ? "inherit" : "pipe", encoding: "utf8" }).trim()

const ensureDir = (p: string) => mkdirSync(p, { recursive: true })
const resetDir = (p: string) => {
	if (existsSync(p)) rmSync(p, { recursive: true, force: true })
	ensureDir(p)
}

async function loadConfig() {
	const abs = resolve(ROOT, configPath)

	if (!existsSync(abs)) {
		// biome-ignore lint/suspicious/noConsole: for debuging
		console.error(`❌ Config file not found: ${abs}`)
		process.exit(1)
	}

	const mod = await import(pathToFileURL(abs).href)
	return DocsConfigSchema.parse(mod.default ?? mod.config ?? mod)
}

const allTags = () => sh("git tag --list").split("\n").filter(Boolean)

function resolveTags(cfg: DocsConfig) {
	const tags = allTags()
	const valid = tags.filter((t) => Boolean(semver.valid(t)))
	if ("latest" in cfg.versions) return valid.sort(semver.rcompare).slice(0, cfg.versions.latest)
	if ("exact" in cfg.versions) return cfg.versions.exact.filter((t) => tags.includes(t))
	return cfg.versions.ranges
		.flatMap((r) => valid.filter((t) => semver.satisfies(t, r)))
		.filter((t, i, arr) => arr.indexOf(t) === i)
		.sort(semver.rcompare)
}

function buildTag(tag: string, cfg: DocsConfig) {
	const tmp = mkdtempSync(join(tmpdir(), "docs-wt-"))
	const WT = join(tmp, "repo")
	sh(`git worktree add --detach "${WT}" "${tag}"`)
	try {
		const outDir = join(resolve(ROOT, cfg.output.baseDir), tag)
		resetDir(outDir) // This may be removed in the future, but for now we ensure a clean output directory

		const docsDir = resolve(WT, cfg.content.docsDir)
		if (!existsSync(docsDir)) return console.error(`Missing docsDir for ${tag}: ${docsDir}`)

		execSync("pnpm -s content-collections:build", {
			cwd: WT,
			stdio: "inherit",
			// biome-ignore lint/nursery/noProcessEnv: <explanation>
			env: { ...process.env, DOCS_OUT_DIR: outDir },
		})
		// biome-ignore lint/suspicious/noConsole: for debuging
		console.log(`✔ ${tag} -> ${outDir}`)
	} finally {
		try {
			sh(`git worktree remove --force "${WT}"`)
		} catch {}
	}
}
;(async () => {
	const cfg = await loadConfig()
	const tags = resolveTags(cfg)
	if (!tags.length) {
		// biome-ignore lint/suspicious/noConsole: For debuging
		console.error("❌ No matching tags.")
		process.exit(1)
	}

	// biome-ignore lint/suspicious/noConsole: For debuging
	console.log(`Building docs for: ${tags.join(", ")}`)
	for (const tag of tags) {
		buildTag(tag, cfg)
	}
	// biome-ignore lint/suspicious/noConsole: For debuging
	console.log("✅ Done.")
})().catch((e) => {
	// biome-ignore lint/suspicious/noConsole: For debuging
	console.error(e)
	process.exit(1)
})
