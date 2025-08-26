import { type ExecSyncOptions, execSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import { isAbsolute, join, resolve } from "node:path"
import { parseArgs } from "node:util"
import chalk from "chalk"
import semver from "semver"

type RunOpts = { cwd?: string; inherit?: boolean }
function run(cmd: string, opts: RunOpts = {}) {
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

// biome-ignore lint/nursery/noProcessEnv: we use checkout path in actions if present, otherwise detect repo root
const REPO_TOP = process.env.GITHUB_WORKSPACE || run("git rev-parse --show-toplevel")

const allTags = () => run("git tag --list", { cwd: REPO_TOP }).split("\n").filter(Boolean)

function resolveTagsFromSpec(spec: string) {
	const tags = allTags().filter((t) => semver.valid(t))
	const tokens = spec
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean)

	const matched = new Set<string>()
	for (const token of tokens) {
		for (const tag of tags) {
			if (semver.satisfies(tag, token, { includePrerelease: true })) {
				matched.add(tag)
			}
		}
	}

	return [...matched].sort(semver.rcompare)
}

function buildTag(tag: string, docsDir: string, outBase: string) {
	const tmpBase = mkdtempSync(resolve(os.tmpdir(), "docs-wt-"))
	const worktreePath = resolve(tmpBase, tag)

	run(`git worktree add --detach "${worktreePath}" "refs/tags/${tag}"`, { cwd: REPO_TOP, inherit: true })

	if (existsSync(resolve(worktreePath, "package.json"))) {
		run("pnpm install --frozen-lockfile", { cwd: worktreePath, inherit: true })
	}

	try {
		const docsWorkspace = resolve(worktreePath, "docs")
		const docsContentDir = isAbsolute(docsDir) ? docsDir : resolve(docsWorkspace, docsDir)

		if (existsSync(resolve(docsWorkspace, "package.json"))) {
			run("pnpm install --frozen-lockfile", { cwd: docsWorkspace, inherit: true })
		}

		if (!existsSync(docsWorkspace)) {
			throw new Error(`Docs workspace not found in worktree: ${docsWorkspace}`)
		}
		if (!existsSync(docsContentDir)) {
			throw new Error(`Docs content directory "${docsDir}" not found in tag ${tag} (looked at ${docsContentDir}).`)
		}

		const outDir = join(resolve(outBase), tag)
		buildDocs(docsWorkspace, outDir)
	} finally {
		run(`git worktree remove "${worktreePath}" --force`, { cwd: REPO_TOP, inherit: true })
		rmSync(tmpBase, { recursive: true, force: true })
	}
}

function buildDocs(sourceDir: string, outDir: string) {
	if (!existsSync(sourceDir)) throw new Error(`Docs source not found: ${sourceDir}`)
	resetDir(outDir)

	run("pnpm run content-collections:build", { cwd: sourceDir, inherit: true })

	const ccSrc = resolve(sourceDir, ".content-collections")
	const ccDest = join(outDir, ".content-collections")
	if (!existsSync(ccSrc)) throw new Error(`Build output missing at ${ccSrc}`)

	resetDir(ccDest)
	cpSync(ccSrc, ccDest, { recursive: true })
	// biome-ignore lint/suspicious/noConsole: keep console log for debugging
	console.log(chalk.green(`✔ Built docs → ${ccDest}`))
}
;(async () => {
	const { values } = parseArgs({
		args: process.argv.slice(2),
		options: { versions: { type: "string", default: "main" } },
	})

	const outBase = "generated-docs"
	const docsDir = "content"

	if (values.versions === "main") {
		// biome-ignore lint/suspicious/noConsole: keep console log for debugging
		console.log(chalk.cyan("Building docs from main branch"))
		buildDocs(resolve(REPO_TOP, "docs"), join(outBase, "main"))
	} else {
		const tags = resolveTagsFromSpec(values.versions)
		if (!tags.length) {
			// biome-ignore lint/suspicious/noConsole: keep console log for debugging
			console.log(chalk.yellow("No tags matched → building main instead"))
			buildDocs(resolve(REPO_TOP, "docs"), join(outBase, "main"))
		} else {
			// biome-ignore lint/suspicious/noConsole: keep console log for debugging
			console.log(chalk.cyan(`Building docs for: ${tags.join(", ")}`))
			for (const tag of tags) buildTag(tag, docsDir, outBase)
		}
	}

	const versions = values.versions === "main" ? ["main"] : resolveTagsFromSpec(values.versions)
	const versionsFile = resolve("app/utils/versions.ts")
	writeFileSync(
		versionsFile,
		`// Auto-generated file. Do not edit manually.
export const versions = ${JSON.stringify(versions, null, 2)} as const
`
	)
	// biome-ignore lint/suspicious/noConsole: keep console log for debugging
	console.log(chalk.green(`✔ Wrote versions.ts → ${versionsFile}`))
	// biome-ignore lint/suspicious/noConsole: keep console log for debugging
	console.log(chalk.green("✅ Done"))
})().catch((e) => {
	// biome-ignore lint/suspicious/noConsole: keep console error for debugging
	console.error(chalk.red("❌ Build failed:"), e)
	process.exit(1)
})
