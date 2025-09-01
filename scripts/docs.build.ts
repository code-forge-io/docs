import { type ExecSyncOptions, execSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import { join, relative, resolve } from "node:path"
import { parseArgs } from "node:util"
import chalk from "chalk"
import semver from "semver"
import { getServerEnv } from "~/env.server"

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
const APP_ENV = getServerEnv().APP_ENV

// biome-ignore lint/nursery/noProcessEnv: we use checkout path in Actions if present, otherwise detect repo root
const REPO_TOP = process.env.GITHUB_WORKSPACE || run("git rev-parse --show-toplevel")
const DEFAULT_BRANCH =
	// biome-ignore lint/nursery/noProcessEnv: we can get default branch from env in Actions
	process.env.DEFAULT_BRANCH ||
	run("git rev-parse --abbrev-ref origin/HEAD", { cwd: REPO_TOP }).split("/").pop() ||
	"main"
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

function buildRef(ref: string, labelForOutDir: string) {
	const tmpBase = mkdtempSync(resolve(os.tmpdir(), "docs-wt-"))
	const safeLabel = labelForOutDir.replace(/[^\w.-]+/g, "_")
	const worktreePath = resolve(tmpBase, safeLabel)

	run(`git worktree add --detach "${worktreePath}" "${ref}"`, {
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

		const outDir = join(resolve(OUT_BASE), labelForOutDir)
		buildDocs(docsWorkspace, outDir)
	} finally {
		run(`git worktree remove "${worktreePath}" --force`, {
			cwd: REPO_TOP,
			inherit: true,
		})
		rmSync(tmpBase, { recursive: true, force: true })
	}
}

function buildTag(tag: string) {
	return buildRef(`refs/tags/${tag}`, tag)
}

function buildSpecifiedTags(spec: string, envLabel: "dev" | "prod"): string[] {
	const tags = resolveTagsFromSpec(spec)
	if (!tags.length) {
		throw new Error(
			`No tags matched spec "${spec}". Nothing to build in ${envLabel === "dev" ? "development" : "production"}.`
		)
	}
	// biome-ignore lint/suspicious/noConsole: keep console log for debugging
	console.log(chalk.cyan(`(${envLabel}) Building docs for tags: ${tags.join(", ")}`))
	for (const tag of tags) buildTag(tag)
	return tags
}
;(async () => {
	const { values } = parseArgs({
		args: process.argv.slice(2),
		options: {
			versions: { type: "string" },
		},
	})

	const hasVersions = typeof values.versions === "string" && values.versions.trim().length > 0
	let builtVersions: string[] = []

	if (!hasVersions && APP_ENV === "development") {
		// DEV + no --versions => build current workspace → generated-docs/current
		// biome-ignore lint/suspicious/noConsole: keep console log for debugging
		console.log(chalk.cyan(`(dev) Building docs from current workspace: ${CWD} → current`))
		buildDocs(CWD, join(OUT_BASE, "current"))
		builtVersions = ["current"]
	} else if (!hasVersions && APP_ENV === "production") {
		// PROD + no --versions => build default branch only
		// biome-ignore lint/suspicious/noConsole: keep console log for debugging
		console.log(chalk.cyan(`(prod) Building docs from '${DEFAULT_BRANCH}' branch only → ${DEFAULT_BRANCH}`))
		buildRef(`refs/heads/${DEFAULT_BRANCH}`, DEFAULT_BRANCH)
		builtVersions = [DEFAULT_BRANCH]
	} else {
		builtVersions = buildSpecifiedTags(values.versions as string, APP_ENV === "development" ? "dev" : "prod")
	}

	const versionsFile = resolve("app/utils/versions.ts")
	writeFileSync(
		versionsFile,
		`// Auto-generated file. Do not edit manually.
export const versions = ${JSON.stringify(builtVersions, null, 2)} as const
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
