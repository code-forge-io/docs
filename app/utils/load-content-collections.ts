import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { Page } from "content-collections"
import type { Section } from "content-collections"
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

	const allPages = pagesMod.default as Page[]
	const allSections = sectionsMod.default as Section[]
	if (!Array.isArray(allPages) || !Array.isArray(allSections)) {
		throw new Error(`Generated modules must default-export arrays (allPages/allSections) for version ${version}.`)
	}

	return { allPages, allSections }
}
