import type { SidebarSection } from "~/utils/create-sidebar-tree"

export function flattenSidebarItems(sections: SidebarSection[]) {
	const collectPages = (section: SidebarSection): { title: string; slug: string }[] => {
		const pages = [...section.documentationPages]
		for (const subsection of section.subsections) {
			pages.push(...collectPages(subsection))
		}
		return pages
	}

	return sections.flatMap(collectPages)
}
