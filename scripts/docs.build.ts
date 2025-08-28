import { type ExecSyncOptions, execSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import { join, relative, resolve } from "node:path"
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

const CONTENT_DIR_NAME = "content"
const OUT_BASE = "generated-docs"

// biome-ignore lint/nursery/noProcessEnv: we use checkout path in Actions if present, otherwise detect repo root
const REPO_TOP = process.env.GITHUB_WORKSPACE || run("git rev-parse --show-toplevel")

// current docs workspace - where the script is run from
const CWD = process.cwd()
// Path to docs workspace relative to repo root
const DOCS_REL = relative(REPO_TOP, CWD)

const allTags = () => run("git tag --list", { cwd: REPO_TOP }).split("\n").filter(Boolean)

function resolveTagsFromSpec(spec: string) {
	const tags = allTags().filter((t) => semver.valid(t))
	const tokens = spec
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean)

	const matched = tags.filter((tag) =>
		tokens.some((token) => semver.satisfies(tag, token, { includePrerelease: true }))
	)

	return matched.sort(semver.rcompare)
}

function buildDocs(sourceDir: string, outDir: string) {
	if (!existsSync(sourceDir)) throw new Error(`Docs workspace not found: ${sourceDir}`)

	const docsContentDir = resolve(sourceDir, CONTENT_DIR_NAME)
	if (!existsSync(docsContentDir)) {
		throw new Error(`Docs content directory "${CONTENT_DIR_NAME}" not found at ${docsContentDir}`)
	}

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

function buildTag(tag: string) {
	const tmpBase = mkdtempSync(resolve(os.tmpdir(), "docs-wt-"))
	const worktreePath = resolve(tmpBase, tag)

	run(`git worktree add --detach "${worktreePath}" "refs/tags/${tag}"`, {
		cwd: REPO_TOP,
		inherit: true,
	})

	try {
		const docsWorkspace = resolve(worktreePath, DOCS_REL)

		if (existsSync(resolve(docsWorkspace, "package.json"))) {
			run("pnpm install --frozen-lockfile", { cwd: docsWorkspace, inherit: true })
		}

		if (existsSync(resolve(worktreePath, "package.json"))) {
			run("pnpm install --frozen-lockfile", { cwd: worktreePath, inherit: true })
		}

		const outDir = join(resolve(OUT_BASE), tag)
		buildDocs(docsWorkspace, outDir)
	} finally {
		run(`git worktree remove "${worktreePath}" --force`, {
			cwd: REPO_TOP,
			inherit: true,
		})
		rmSync(tmpBase, { recursive: true, force: true })
	}
}
;(async () => {
	const { values } = parseArgs({
		args: process.argv.slice(2),
		options: {
			versions: { type: "string", default: "main" },
		},
	})

	if (values.versions === "main") {
		// biome-ignore lint/suspicious/noConsole: keep console log for debugging
		console.log(chalk.cyan(`Building docs from current workspace: ${CWD}`))
		buildDocs(CWD, join(OUT_BASE, "main"))
	} else {
		const tags = resolveTagsFromSpec(values.versions as string)
		if (!tags.length) {
			// biome-ignore lint/suspicious/noConsole: keep console log for debugging
			console.log(chalk.yellow("No tags matched → building current workspace as 'main' instead"))
			buildDocs(CWD, join(OUT_BASE, "main"))
		} else {
			// biome-ignore lint/suspicious/noConsole: keep console log for debugging
			console.log(chalk.cyan(`Building docs for: ${tags.join(", ")}`))
			for (const tag of tags) buildTag(tag)
		}
	}

	const versions = values.versions === "main" ? ["main"] : resolveTagsFromSpec(values.versions as string)

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
