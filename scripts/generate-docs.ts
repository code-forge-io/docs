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

const contentDir = "content"
const workspaceRoot = process.cwd()
const outputDir = resolve(workspaceRoot, "generated-docs")

// If this script is executed from a subdirectory of the repository (for example
// the `docs/` package inside a monorepo), we need the path of that subdir
// relative to the repository root so worktrees point at the right package.
let repoRoot = workspaceRoot
let workspaceRelativePath = ""
try {
	// This will return the repository top-level directory.
	repoRoot = run("git rev-parse --show-toplevel")
	// Compute the path from repo root to the current working dir. If empty,
	// we are at repo root and no adjustment is needed.
	// Use posix-style join/resolve via path utilities already imported.
	workspaceRelativePath = repoRoot === workspaceRoot ? "" : relative(repoRoot, workspaceRoot)
} catch {
	// If git is not available or the command fails, fall back to assuming the
	// current working directory is the repository root.
	repoRoot = workspaceRoot
	workspaceRelativePath = ""
}

// biome-ignore lint/suspicious/noConsole: TODO remove this
console.log(chalk.cyan(`Docs workspace root: ${workspaceRoot}`))
// biome-ignore lint/suspicious/noConsole: TODO remove this
console.log("outputDir:", outputDir)
const allTags = () => run("git tag --list").split("\n").filter(Boolean)

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

function hasLocalRef(ref: string) {
	try {
		run(`git show-ref --verify --quiet ${ref}`)
		return true
	} catch {
		return false
	}
}

function buildDocs(sourceDir: string, outDir: string) {
	if (!existsSync(sourceDir)) {
		throw new Error(
			`❌ Documentation workspace not found at: ${sourceDir}
   Cannot build documentation without a valid workspace directory.`
		)
	}

	// biome-ignore lint/suspicious/noConsole: TODO remove this
	console.log(chalk.cyan(`Building docs from: ${sourceDir} → ${outDir}`))
	const docsContentDir = resolve(sourceDir, contentDir)
	if (!existsSync(docsContentDir)) {
		throw new Error(
			`❌ Content directory "${contentDir}" not found at: ${docsContentDir}
   Cannot build documentation without content files.
   Please ensure you have a "${contentDir}/" directory with your documentation content.`
		)
	}

	const packageJsonPath = resolve(sourceDir, "package.json")
	if (!existsSync(packageJsonPath)) {
		throw new Error(
			`❌ package.json not found at: ${packageJsonPath}
   Cannot build documentation without package.json.
   Please ensure your workspace has a valid package.json file.`
		)
	}

	resetDir(outDir)
	run("pnpm run content-collections:build", { cwd: sourceDir, inherit: true })

	const ccSrc = resolve(sourceDir, ".content-collections")
	const ccDest = join(outDir, ".content-collections")
	if (!existsSync(ccSrc)) {
		throw new Error(
			`❌ Build output missing at: ${ccSrc}
   Content collections build failed or did not produce output.
   Please check the build logs above for errors.`
		)
	}

	resetDir(ccDest)
	cpSync(ccSrc, ccDest, { recursive: true })

	// biome-ignore lint/suspicious/noConsole: keep for debugging
	console.log(chalk.green(`✔ Built docs → ${ccDest}`))
}

function buildRef(ref: string, labelForOutDir: string) {
	const tmpBase = mkdtempSync(resolve(os.tmpdir(), "docs-wt-"))
	const safeLabel = labelForOutDir.replace(/[^\w.-]+/g, "_")
	const worktreePath = resolve(tmpBase, safeLabel)

	run(`git worktree add --detach "${worktreePath}" "${ref}"`, {
		cwd: workspaceRoot,
		inherit: true,
	})

	try {
		// Install dependencies at root if package.json exists
		const rootPkg = existsSync(resolve(worktreePath, "package.json"))
		const rootLock = existsSync(resolve(worktreePath, "pnpm-lock.yaml"))
		if (rootPkg) {
			run(`pnpm install ${rootLock ? "--frozen-lockfile" : "--no-frozen-lockfile"}`, {
				cwd: worktreePath,
				inherit: true,
			})
		}

		// If this script was run from a subdirectory (for example `docs/` inside
		// a monorepo), adjust the sourceDir inside the created worktree so we
		// build the correct package.
		const sourceDir = workspaceRelativePath ? resolve(worktreePath, workspaceRelativePath) : worktreePath
		const outDir = resolve(outputDir, labelForOutDir)
		buildDocs(sourceDir, outDir)
	} finally {
		run(`git worktree remove "${worktreePath}" --force`, {
			cwd: workspaceRoot,
			inherit: true,
		})
		rmSync(tmpBase, { recursive: true, force: true })
	}
}

function buildBranch(branch: string, labelForOutDir: string) {
	run(`git fetch --tags --prune origin ${branch}`, {
		cwd: workspaceRoot,
		inherit: true,
	})
	const localRef = `refs/heads/${branch}`
	const targetRef = hasLocalRef(localRef) ? localRef : `origin/${branch}`
	return buildRef(targetRef, labelForOutDir)
}

function buildTag(tag: string) {
	return buildRef(`refs/tags/${tag}`, tag)
}

function getCurrentBranch(): string {
	try {
		return run("git rev-parse --abbrev-ref HEAD")
	} catch {
		throw new Error("Failed to get current branch")
	}
}

function isOnDefaultBranch(defaultBranch: string): boolean {
	const currentBranch = getCurrentBranch()
	return currentBranch === defaultBranch
}
;(async () => {
	const { values } = parseArgs({
		args: process.argv.slice(2),
		options: {
			versions: { type: "string" }, // optional: comma/space list of semver ranges or exact tags
			branch: { type: "string" }, // required: specify default branch name (e.g., main, master, develop)
		},
	})

	// Get default branch from --branch flag (required)
	const defaultBranch = (values.branch as string | undefined)?.trim()
	if (!defaultBranch) {
		throw new Error(
			`❌ Missing required --branch flag.
   Please specify the default branch name (e.g., --branch main)
   Example: pnpm run generate:docs --branch main`
		)
	}

	const rawVersions = (values.versions as string | undefined)?.trim() ?? ""
	const hasVersionsArg = rawVersions.length > 0

	let builtVersions: string[] = []

	// Determine which branch to build as "current"
	const onDefaultBranch = isOnDefaultBranch(defaultBranch)
	const currentBranchToBuild = onDefaultBranch ? defaultBranch : getCurrentBranch()

	// biome-ignore lint/suspicious/noConsole: keep for logging
	console.log(chalk.cyan(`Building from branch: ${currentBranchToBuild}`))

	if (hasVersionsArg) {
		// Build specified version tags + current branch
		const tags = resolveTagsFromSpec(rawVersions)
		if (!tags.length) throw new Error(`No tags matched spec "${rawVersions}".`)

		// biome-ignore lint/suspicious/noConsole: keep for logging
		console.log(chalk.cyan(`Building tags: ${tags.join(", ")}`))
		for (const t of tags) buildTag(t)

		// Build current branch
		if (onDefaultBranch) {
			// biome-ignore lint/suspicious/noConsole: keep for logging
			console.log(chalk.cyan(`Building default branch '${defaultBranch}' → current`))
			buildBranch(defaultBranch, "current")
		} else {
			// biome-ignore lint/suspicious/noConsole: keep for logging
			console.log(chalk.cyan("Building current workspace → current"))
			buildDocs(workspaceRoot, join(outputDir, "current"))
		}

		builtVersions = ["current", ...tags]
	} else {
		// Build only current branch
		if (onDefaultBranch) {
			// biome-ignore lint/suspicious/noConsole: keep for logging
			console.log(chalk.cyan(`Building default branch '${defaultBranch}' → current`))
			buildBranch(defaultBranch, "current")
		} else {
			// biome-ignore lint/suspicious/noConsole: keep for logging
			console.log(chalk.cyan("Building current workspace → current"))
			buildDocs(workspaceRoot, join(outputDir, "current"))
		}

		builtVersions = ["current"]
	}

	// Write versions file for the app
	const versionsFile = resolve(workspaceRoot, "app/utils/versions.ts")
	writeFileSync(
		versionsFile,
		`// Auto-generated file. Do not edit manually.
export const versions = ${JSON.stringify(builtVersions, null, 2)} as const
`
	)
	// biome-ignore lint/suspicious/noConsole: keep for logging
	console.log(chalk.green(`✔ Wrote versions.ts → ${versionsFile}`))
	// biome-ignore lint/suspicious/noConsole: keep for logging
	console.log(chalk.green("✅ Done"))
})().catch((e) => {
	// biome-ignore lint/suspicious/noConsole: keep for logging
	console.error(chalk.red("❌ Build failed:"), e)
	process.exit(1)
})
