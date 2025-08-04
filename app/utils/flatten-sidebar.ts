import type { SidebarSection } from "~/utils/create-sidebar-tree"

export function flattenSidebarItems(sections: SidebarSection[]) {
	const collectPages = (section: SidebarSection): { title: string; slug: string }[] => [
		...section.documentationPages,
		...section.subsections.flatMap(collectPages),
	]

	return sections.flatMap(collectPages)
}
