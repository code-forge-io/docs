import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { isAbsolute, relative, resolve } from "node:path"
import chalk from "chalk"
import { loadDocsConfig, requireConfigPathFromCLI } from "./load-docs-config"

export function ensureGitignoreHasOutputBase(baseDir: string) {
	const cwd = process.cwd()
	const gi = resolve(cwd, ".gitignore")

	let rel = isAbsolute(baseDir) ? relative(cwd, baseDir) : baseDir
	rel = rel.replace(/\\/g, "/").replace(/\/?$/, "/")

	const marker = "\n# Output base directory of the documentation (auto-managed)"
	const blockRe = /^(?:#|\/\/)\s*Output base directory of the documentation[^\r\n]*\r?\n[^\r\n]*\r?\n?/m

	const src = existsSync(gi) ? readFileSync(gi, "utf8") : ""
	const next = blockRe.test(src)
		? src.replace(blockRe, `${marker}\n${rel}\n`)
		: `${src}${src && !src.endsWith("\n") ? "\n" : ""}${marker}\n${rel}\n`

	if (next !== src) {
		writeFileSync(gi, next)
		// biome-ignore lint/suspicious/noConsole: keep log for debugging
		console.log(chalk.green(`✔ Updated ${gi} to ignore "${rel}"`))
	} else {
		// biome-ignore lint/suspicious/noConsole: keep log for debugging
		console.log(chalk.gray(`ℹ ${gi} already up to date.`))
	}
}

// CLI usage: `tsx scripts/docs.gitignore.ts --config ./docs/docs.config.ts`
if (process.argv[1]?.endsWith("docs.gitignore.ts")) {
	;(async () => {
		const configPath = requireConfigPathFromCLI()
		const cfg = await loadDocsConfig(configPath)
		ensureGitignoreHasOutputBase(cfg.output.baseDir)
	})()
}
