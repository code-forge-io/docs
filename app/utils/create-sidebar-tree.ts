import { allPages, allSections } from "content-collections"
import type { SidebarSection } from "~/components/sidebar/sidebar"

const parentOf = (slug: string) => slug.split("/").slice(0, -1).join("/")

export function createSidebarTree(version = "latest") {
	const map = new Map<string, SidebarSection>()

	for (const s of allSections.filter((s) => s.version === version)) {
		map.set(s.slug, { ...s, subsections: [], documentationPages: [] })
	}

	for (const node of map.values()) {
		const parentSlug = parentOf(node.slug)
		if (parentSlug && parentSlug !== version) {
			map.get(parentSlug)?.subsections.push(node)
		}
	}

	for (const p of allPages) {
		if (!p.slug.startsWith(`${version}/`)) continue
		const parentSlug = parentOf(p.slug)
		map.get(parentSlug)?.documentationPages.push({ slug: p.slug, title: p.title })
	}

	const rootSections = [...map.values()].filter((section) => parentOf(section.slug) === version)

	return rootSections
}
