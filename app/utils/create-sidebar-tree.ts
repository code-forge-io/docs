import type { SidebarSection } from "~/components/sidebar/sidebar"
import { loadContentCollections } from "./load-content-collections"
import type { Version } from "./version-resolvers"

const parentOf = (slug: string) => {
	const i = slug.lastIndexOf("/")
	return i === -1 ? "" : slug.slice(0, i)
}

export async function createSidebarTree(version: Version) {
	const { allPages, allSections } = await loadContentCollections(version)

	const sections = allSections
	const pages = allPages

	const sectionMap = new Map<string, SidebarSection>()
	for (const s of sections) {
		sectionMap.set(s.slug, {
			...s,
			subsections: [],
			documentationPages: [],
		})
	}

	for (const node of sectionMap.values()) {
		const p = parentOf(node.slug)
		const parent = sectionMap.get(p)
		if (parent) parent.subsections.push(node)
	}

	for (const p of pages) {
		const parts = p.slug.split("/").filter(Boolean)
		if (parts.length < 2) continue
		const parentSlug = parts.length >= 3 ? parts.slice(0, 2).join("/") : parts[0]
		const parent = sectionMap.get(parentSlug)
		if (parent) parent.documentationPages.push({ slug: p.slug, title: p.title })
	}

	return [...sectionMap.values()].filter((s) => !sectionMap.has(parentOf(s.slug)))
}
