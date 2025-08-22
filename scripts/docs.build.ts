import { type ExecSyncOptions, execSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import os from "node:os"
import { isAbsolute, join, resolve } from "node:path"
import chalk from "chalk"
import semver from "semver"
import type { DocsConfig } from "../docs-config/docs.schema"
import { loadDocsConfig, requireConfigPathFromCLI } from "./load-docs-config"
import { ensureGitignoreHasOutputBase } from "./update-docs-gitignore"

type RunOpts = { cwd?: string; inherit?: boolean }
function run(cmd: string, opts: RunOpts = {}): string {
	const exOpts: ExecSyncOptions = {
		cwd: opts.cwd,
		stdio: opts.inherit ? "inherit" : "pipe",
		encoding: "utf8",
	}
	try {
		const res = execSync(cmd, exOpts)
		if (opts.inherit) return ""
		if (typeof res === "string") return res.trim()
		return (res?.toString?.("utf8") ?? "").trim()
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : String(err)
		throw new Error(`Command failed: ${cmd}\n${msg}`)
	}
}

const ensureDir = (p: string) => mkdirSync(p, { recursive: true })
const resetDir = (p: string) => {
	if (existsSync(p)) rmSync(p, { recursive: true, force: true })
	ensureDir(p)
}

// use checkout path in Actions if present; otherwise detect repo root
// biome-ignore lint/nursery/noProcessEnv: this is provided by GitHub Actions
const REPO_TOP = process.env.GITHUB_WORKSPACE || run("git rev-parse --show-toplevel")

const allTags = () => run("git tag --list", { cwd: REPO_TOP }).split("\n").filter(Boolean)

function resolveTags(cfg: DocsConfig) {
	const tags = allTags()
	const valid = tags.filter((t) => semver.valid(t))
	if ("latest" in cfg.versions) return valid.sort(semver.rcompare).slice(0, cfg.versions.latest)
	if ("exact" in cfg.versions) return cfg.versions.exact.filter((t) => tags.includes(t))
	return cfg.versions.ranges
		.flatMap((r) => valid.filter((t) => semver.satisfies(t, r)))
		.filter((t, i, a) => a.indexOf(t) === i)
		.sort(semver.rcompare)
}

function linkNodeModules(fromDir: string, toDir: string) {
	if (!existsSync(fromDir)) return
	if (existsSync(toDir)) rmSync(toDir, { recursive: true, force: true })
	symlinkSync(fromDir, toDir, process.platform === "win32" ? "junction" : "dir")
}

function buildTag(tag: string, cfg: DocsConfig) {
	const tmpBase = mkdtempSync(resolve(os.tmpdir(), "docs-wt-"))
	const worktreePath = resolve(tmpBase, tag)

	run(`git worktree add --detach "${worktreePath}" "refs/tags/${tag}"`, { cwd: REPO_TOP, inherit: true })

	try {
		linkNodeModules(resolve(REPO_TOP, "node_modules"), resolve(worktreePath, "node_modules"))
		linkNodeModules(resolve(REPO_TOP, "docs", "node_modules"), resolve(worktreePath, "docs", "node_modules"))

		const docsWorkspace = resolve(worktreePath, "docs")
		const docsContentDir = isAbsolute(cfg.content.docsDir)
			? cfg.content.docsDir
			: resolve(docsWorkspace, cfg.content.docsDir)

		if (!existsSync(docsWorkspace)) {
			throw new Error(`Docs workspace not found in worktree: ${docsWorkspace}`)
		}
		if (!existsSync(docsContentDir)) {
			throw new Error(
				`Docs content directory "${cfg.content.docsDir}" not found in tag ${tag} (looked at ${docsContentDir}).`
			)
		}

		const outDir = join(resolve(cfg.output.baseDir), tag)
		resetDir(outDir)

		run("pnpm run content-collections:build", { cwd: docsWorkspace, inherit: true })

		const ccSrc = resolve(docsWorkspace, ".content-collections")
		const ccDest = join(outDir, ".content-collections")
		if (!existsSync(ccSrc)) {
			throw new Error(`Expected build output at ${ccSrc} but it does not exist.`)
		}
		resetDir(ccDest)
		cpSync(ccSrc, ccDest, { recursive: true })

		// biome-ignore lint/suspicious/noConsole: keep log for debugging
		console.log(chalk.green(`✔ ${tag}`), chalk.gray(`→ ${ccDest}`))
	} finally {
		run(`git worktree remove "${worktreePath}" --force`, { cwd: REPO_TOP, inherit: true })
		rmSync(tmpBase, { recursive: true, force: true })
	}
}
;(async () => {
	const configPath = requireConfigPathFromCLI()
	const cfg = await loadDocsConfig(configPath)
	const tags = resolveTags(cfg)

	if (!tags.length) {
		// biome-ignore lint/suspicious/noConsole: keep log for debugging
		console.error(chalk.red("❌ No matching tags."))
		process.exit(1)
	}
	// biome-ignore lint/suspicious/noConsole: keep log for debugging
	console.log(chalk.cyan(`Building docs for: ${tags.join(", ")}`))
	for (const tag of tags) {
		// biome-ignore lint/suspicious/noConsole: keep log for debugging
		console.log(chalk.blue(`\n➡️  Building ${tag}`))
		buildTag(tag, cfg)
	}

	const sorted = [...tags].sort((a, b) => b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" }))
	const versionsFile = resolve("app/utils/versions.ts")
	const content = `// Auto-generated file. Do not edit manually.
export const versions = ${JSON.stringify(sorted, null, 2)} as const
`
	writeFileSync(versionsFile, content)
	// biome-ignore lint/suspicious/noConsole: keep log for debugging
	console.log(chalk.green(`\n✔ Wrote versions.ts with ${tags.length} versions → ${versionsFile}`))

	// keep .gitignore up to date )
	ensureGitignoreHasOutputBase(cfg.output.baseDir)
	// biome-ignore lint/suspicious/noConsole: keep log for debugging
	console.log(chalk.green("\n✅ Done."))
})().catch((e) => {
	// biome-ignore lint/suspicious/noConsole: keep log for debugging
	console.error(chalk.red("❌ Build failed:"), e)
	process.exit(1)
})
