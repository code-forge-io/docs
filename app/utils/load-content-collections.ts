import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { Version } from "./version-resolvers"

/**
 * Load content-collections outputs
 * Always read from generated-docs
 * If no tags/releases exist → fallback to main branch (production) or current (development)
 * During development, if generated-docs missing → tell user to run generate:docs
 */
export async function loadContentCollections(version: Version) {
	const here = dirname(fileURLToPath(import.meta.url))
	const genBase = resolve(here, "../../generated-docs", version, ".content-collections", "generated")

	const pagesMod = await import(/* @vite-ignore */ `${genBase}/allPages.js`)
	const sectionsMod = await import(/* @vite-ignore */ `${genBase}/allSections.js`)

	const allPages = pagesMod.default
	const allSections = sectionsMod.default
	if (!Array.isArray(allPages) || !Array.isArray(allSections)) {
		throw new Error(`Generated modules must default-export arrays (allPages/allSections) for version ${version}.`)
	}

	return { allPages, allSections }
}
