import { type ExecSyncOptions, execSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import { join, resolve } from "node:path"
import { parseArgs } from "node:util"
import chalk from "chalk"
import semver from "semver"
// import { getServerEnv } from "~/env.server"

// const APP_ENV = getServerEnv().APP_ENV as "development" | "production"
const CONTENT_DIR = "content"
const OUTPUT_DIR = "generated-docs"
const CURRENT_WORKSPACE = process.cwd()

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

function ensureDir(dir: string) {
	mkdirSync(dir, { recursive: true })
}

function resetDir(dir: string) {
	if (existsSync(dir)) rmSync(dir, { recursive: true, force: true })
	ensureDir(dir)
}

// function repoPath(...segments: string[]) {
// 	return path.normalize(path.join(...segments.filter(Boolean)))
// }

// const REPO_ROOT = run("git rev-parse --show-toplevel", { cwd: CURRENT_WORKSPACE })

const WORKSPACE_RELATIVE = (() => {
	try {
		return run("git rev-parse --show-prefix", { cwd: CURRENT_WORKSPACE }).replace(/\/?$/, "")
	} catch {
		return ""
	}
})()

function getAllTags() {
	return run("git tag --list").split("\n").filter(Boolean)
}

function resolveTagsFromSpec(spec: string) {
	const allValidTags = getAllTags().filter((t) => semver.valid(t))
	const specTokens = spec
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean)

	const matchedTags = allValidTags.filter((tag) =>
		specTokens.some((token) => semver.satisfies(tag, token, { includePrerelease: true }))
	)

	return matchedTags.sort(semver.rcompare)
}

// function hasLocalRef(ref: string) {
// 	try {
// 		run(`git show-ref --verify --quiet ${ref}`)
// 		return true
// 	} catch {
// 		return false
// 	}
// }

// function refHasPath(ref: string, pathFromRepoRoot: string): boolean {
// 	const cleanPath = pathFromRepoRoot.replace(/^\/+/, "").replace(/\/+$/, "")
// 	try {
// 		run(`git -C "${REPO_ROOT}" rev-parse --verify --quiet "${ref}:${cleanPath}"`)
// 		return true
// 	} catch {
// 		return false
// 	}
// }

// function fetchBranch(branch: string) {
// 	run(`git fetch --tags --prune origin ${branch}`, { cwd: CURRENT_WORKSPACE, inherit: true })
// }

function buildDocs(sourceDir: string, outDir: string) {
	if (!existsSync(sourceDir)) {
		throw new Error(`Docs workspace not found: ${sourceDir}`)
	}

	const contentPath = resolve(sourceDir, CONTENT_DIR)
	if (!existsSync(contentPath)) {
		throw new Error(`Content directory "${CONTENT_DIR}" not found at ${contentPath}`)
	}

	resetDir(outDir)
	run("pnpm run content-collections:build", { cwd: sourceDir, inherit: true })

	const buildSrc = resolve(sourceDir, ".content-collections")
	const buildDest = join(outDir, ".content-collections")

	if (!existsSync(buildSrc)) {
		throw new Error(`Build output missing at ${buildSrc}`)
	}

	resetDir(buildDest)
	cpSync(buildSrc, buildDest, { recursive: true })

	// biome-ignore lint/suspicious/noConsole: build logging
	console.log(chalk.green(`✔ Built docs → ${buildDest}`))
}

function installDependencies(worktreePath: string, docsWorkspace: string) {
	const hasRootPackage = existsSync(resolve(worktreePath, "package.json"))
	const hasRootLock = existsSync(resolve(worktreePath, "pnpm-lock.yaml"))

	if (hasRootPackage) {
		const lockFlag = hasRootLock ? "--frozen-lockfile" : "--no-frozen-lockfile"
		run(`pnpm install ${lockFlag}`, { cwd: worktreePath, inherit: true })
	}

	if (docsWorkspace !== worktreePath) {
		const hasDocsPackage = existsSync(resolve(docsWorkspace, "package.json"))
		const hasDocsLock = existsSync(resolve(docsWorkspace, "pnpm-lock.yaml"))

		if (hasDocsPackage && hasDocsLock) {
			run("pnpm install --frozen-lockfile", { cwd: docsWorkspace, inherit: true })
		}
	}
}

function buildFromRef(ref: string, label: string) {
	const tmpDir = mkdtempSync(resolve(os.tmpdir(), "docs-wt-"))
	const safeLabel = label.replace(/[^\w.-]+/g, "_")
	const worktreePath = resolve(tmpDir, safeLabel)

	run(`git worktree add --detach "${worktreePath}" "${ref}"`, {
		cwd: CURRENT_WORKSPACE,
		inherit: true,
	})

	try {
		const docsWorkspace = WORKSPACE_RELATIVE ? resolve(worktreePath, WORKSPACE_RELATIVE) : worktreePath

		installDependencies(worktreePath, docsWorkspace)

		const outDir = resolve(OUTPUT_DIR, label)
		buildDocs(docsWorkspace, outDir)
	} finally {
		run(`git worktree remove "${worktreePath}" --force`, {
			cwd: CURRENT_WORKSPACE,
			inherit: true,
		})
		rmSync(tmpDir, { recursive: true, force: true })
	}
}

// function buildFromBranch(branch: string, label: string) {
// 	fetchBranch(branch)
// 	const localRef = `refs/heads/${branch}`
// 	const targetRef = hasLocalRef(localRef) ? localRef : `origin/${branch}`
// 	buildFromRef(targetRef, label)
// }

function buildFromTag(tag: string) {
	buildFromRef(`refs/tags/${tag}`, tag)
}

function buildCurrentWorkspace(label: string) {
	const outDir = resolve(OUTPUT_DIR, label)
	buildDocs(CURRENT_WORKSPACE, outDir)
}

// function buildMainBranchFallback(branch: string) {
// 	const contentPath = repoPath(WORKSPACE_RELATIVE, CONTENT_DIR)
// 	fetchBranch(branch)

// 	const hasContent = refHasPath(`origin/${branch}`, contentPath)
// 	if (!hasContent) {
// 		throw new Error(`Branch 'origin/${branch}' has no '${contentPath}'. Cannot build docs.`)
// 	}

// 	// biome-ignore lint/suspicious/noConsole: build logging
// 	console.log(chalk.cyan(`Building fallback: branch '${branch}' → ${branch}`))
// 	buildFromBranch(branch, branch)
// 	return [branch]
// }

function writeVersionsFile(versions: string[]) {
	const versionsFile = resolve("app/utils/versions.ts")
	const content = `// Auto-generated file. Do not edit manually.
export const versions = ${JSON.stringify(versions, null, 2)} as const
`
	writeFileSync(versionsFile, content)

	// biome-ignore lint/suspicious/noConsole: build logging
	console.log(chalk.green(`✔ Wrote versions.ts → ${versionsFile}`))
}
function parseCliArgs() {
	const { values } = parseArgs({
		args: process.argv.slice(2),
		options: {
			versions: { type: "string" }, // optional
		},
	})

	const versions = (values.versions as string | undefined)?.trim() ?? ""
	return { versions }
}

async function main() {
	const { versions: versionsSpec } = parseCliArgs()
	let builtVersions: string[]

	// Try to build version tags if specified
	if (versionsSpec) {
		const tags = resolveTagsFromSpec(versionsSpec)

		if (tags.length > 0) {
			// Build version tags
			// biome-ignore lint/suspicious/noConsole: build logging
			console.log(chalk.cyan(`Building tags: ${tags.join(", ")}`))
			for (const tag of tags) {
				buildFromTag(tag)
			}
			builtVersions = tags
		} else {
			// No tags matched → fallback to current workspace
			// biome-ignore lint/suspicious/noConsole: build logging
			console.log(chalk.yellow(`No tags matched "${versionsSpec}", building current workspace`))
			buildCurrentWorkspace("current")
			builtVersions = ["current"]
		}
	} else {
		// No versions specified → build current workspace
		// biome-ignore lint/suspicious/noConsole: build logging
		console.log(chalk.cyan("Building current workspace → current"))
		buildCurrentWorkspace("current")
		builtVersions = ["current"]
	}

	writeVersionsFile(builtVersions)
	// biome-ignore lint/suspicious/noConsole: build logging
	console.log(chalk.green("✅ Done"))
}
main().catch((error) => {
	// biome-ignore lint/suspicious/noConsole: error logging
	console.error(chalk.red("❌ Build failed:"), error)
	process.exit(1)
})
