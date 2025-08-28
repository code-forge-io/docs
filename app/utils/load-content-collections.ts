import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { Version } from "~/utils/versions-utils"

/**
 * Load content-collections outputs
 * Always read from generated-docs.
 * If no tags/releases exist → fall back to main branch
 * If generated-docs missing → tell user to run generate:docs
 */
export async function loadContentCollections(version: Version) {
	const here = dirname(fileURLToPath(import.meta.url))
	const genBase = resolve(here, "../../generated-docs", version, ".content-collections", "generated")

	// Fallback for local dev: if generated output is missing, use local .content-collections
	const localBase = resolve(here, "../../.content-collections", "generated")
	const base =
		existsSync(resolve(genBase, "allPages.js")) && existsSync(resolve(genBase, "allSections.js")) ? genBase : localBase

	const pagesMod = await import(/* @vite-ignore */ `${base}/allPages.js`)
	const sectionsMod = await import(/* @vite-ignore */ `${base}/allSections.js`)

	const allPages = pagesMod.default
	const allSections = sectionsMod.default

	if (!Array.isArray(allPages) || !Array.isArray(allSections)) {
		throw new Error(`Generated modules must default-export arrays (allPages/allSections) for version ${version}.`)
	}

	return { allPages, allSections }
}
