import { href } from "react-router"
import { splitSlug } from "~/utils/split-slug"
import type { SidebarSection } from "./sidebar"

// TODO maybe refactor this>
// TODO add tests after refactoring
export const buildBreadcrumb = (items: SidebarSection[], currentPath: string) => {
	const breadcrumb: string[] = []
	const findBreadcrumb = (section: SidebarSection, path: string[]): boolean => {
		if (
			section.documentationPages.some((doc) => {
				const docPath = href("/:version/:section/:subsection?/:filename", splitSlug(doc.slug))
				if (docPath === currentPath) {
					breadcrumb.push(...path, doc.title)
					return true
				}
				return false
			})
		) {
			return true
		}
		return section.subsections.some((sub) => findBreadcrumb(sub, [...path, section.title]))
	}
	items.some((item) => findBreadcrumb(item, [item.title]))
	return breadcrumb
}
