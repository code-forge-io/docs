import type { Section } from "~/utils/create-sidebar-tree"

export function flattenSidebarItems(sections: Section[]) {
	const collectPages = (section: Section): { title: string; slug: string }[] => {
		const pages = [...section.documentationPages]
		for (const subsection of section.subsections) {
			pages.push(...collectPages(subsection))
		}
		return pages
	}

	return sections.flatMap(collectPages)
}
