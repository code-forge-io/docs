import { existsSync } from "node:fs"
import { isAbsolute, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { parseArgs } from "node:util"
import chalk from "chalk"
import { ZodError } from "zod"
import { type DocsConfig, DocsConfigSchema } from "../docs-config/docs.schema"

export function requireConfigPathFromCLI(): string {
	const { values } = parseArgs({
		args: process.argv.slice(2),
		options: { config: { type: "string" } },
	})
	if (!values.config) {
		// biome-ignore lint/suspicious/noConsole: keep log for debugging
		console.error(chalk.red("❌ You must provide --config <path> (or --config=<path>)"))
		process.exit(1)
	}
	return values.config as string
}

export async function loadDocsConfig(configPath: string): Promise<DocsConfig> {
	const abs = isAbsolute(configPath) ? configPath : resolve(configPath)
	if (!existsSync(abs)) {
		// biome-ignore lint/suspicious/noConsole: keep log for debugging
		console.error(chalk.red(`❌ docs.config.ts file not found! Required to be ${abs}`))
		process.exit(1)
	}
	try {
		const mod = await import(pathToFileURL(abs).href)
		return DocsConfigSchema.parse(mod.default ?? mod.config ?? mod)
	} catch (e) {
		if (e instanceof ZodError) {
			// biome-ignore lint/suspicious/noConsole: keep log for debugging
			console.error(chalk.red("❌ Invalid docs config, please read the README.md file with instructions."))
			//   console.error(chalk.yellow(JSON.stringify(e.format(), null, 2)))
		} else {
			// biome-ignore lint/suspicious/noConsole: keep log for debugging
			console.error(chalk.red("❌ Failed to load config module:"), e)
		}
		process.exit(1)
	}
}
