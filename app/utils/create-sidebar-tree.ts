import type { SidebarSection } from "~/components/sidebar/sidebar"
import { loadContentCollections } from "./load-content-collections"

const parentOf = (slug: string) => slug.split("/").slice(0, -1).join("/")
// TODO refactor this
// biome-ignore lint/suspicious/noExplicitAny: TODO
function unwrap<T>(maybeModule: any): T[] {
	return Array.isArray(maybeModule?.default) ? maybeModule.default : maybeModule
}

export async function createSidebarTree(version: string) {
	const { allPages, allSections } = await loadContentCollections(version)

	const sections = unwrap<SidebarSection>(allSections)
	const pages = unwrap<{ slug: string; title: string }>(allPages)

	const sectionMap = new Map<string, SidebarSection>()
	for (const s of sections) {
		sectionMap.set(s.slug, { ...s, subsections: [], documentationPages: [] })
	}

	for (const node of sectionMap.values()) {
		const parentSlug = parentOf(node.slug)
		if (sectionMap.has(parentSlug)) {
			// biome-ignore lint/style/noNonNullAssertion: TODO
			sectionMap.get(parentSlug)!.subsections.push(node)
		}
	}

	for (const p of pages) {
		const parts = p.slug.split("/").filter(Boolean)
		if (parts.length < 2) continue

		const parentSlug = parts.length >= 3 ? parts.slice(0, 2).join("/") : parts[0]
		const parent = sectionMap.get(parentSlug)
		if (parent) {
			parent.documentationPages.push({ slug: p.slug, title: p.title })
		}
	}

	const rootSections = [...sectionMap.values()].filter((s) => !sectionMap.has(parentOf(s.slug)))
	return rootSections
}
