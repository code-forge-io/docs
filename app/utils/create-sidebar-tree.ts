import { allPages, allSections } from "content-collections"
import type { SidebarSection } from "~/components/sidebar/sidebar"

const parentOf = (slug: string) => slug.split("/").slice(0, -1).join("/")

export function getSidebarTree(version: string): SidebarSection[] {
	const map = new Map<string, SidebarSection>()

	for (const s of allSections.filter((s) => s.version === version)) {
		map.set(s.slug, { ...s, subsections: [], documentationPages: [] })
	}

	for (const node of map.values()) {
		const parent = node.slug.split("/").slice(0, -1).join("/")
		if (parent && parent !== version) {
			map.get(parent)?.subsections.push(node)
		}
	}

	for (const p of allPages) {
		if (!p.slug.startsWith(`${version}/`)) continue
		const parent = p.slug.split("/").slice(0, -1).join("/")
		map.get(parent)?.documentationPages.push({ slug: p.slug, title: p.title })
	}

	return [...map.values()].filter((n) => parentOf(n.slug) === version)
}
