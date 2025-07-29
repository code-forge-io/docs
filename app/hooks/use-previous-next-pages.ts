import { href, useLocation } from "react-router"
import type { SidebarSection } from "~/utils/create-sidebar-tree"
import { flattenSidebarItems } from "~/utils/flatten-sidebar"
import { splitSlug } from "~/utils/split-slug"

export function usePreviousNextPages(sections: SidebarSection[]) {
	const { pathname } = useLocation()

	const flatPages = flattenSidebarItems(sections)
	const currentIndex = flatPages.findIndex((p) => pathname.endsWith(p.slug))

	const getNavItem = (index: number) => {
		const item = flatPages[index]
		if (!item) return undefined

		const { version, section, subsection, fileName } = splitSlug(item.slug)
		return {
			title: item.title,
			to: href("/:version/:section/:subsection?/:filename", {
				version,
				section,
				subsection,
				filename: fileName,
			}),
		}
	}

	return {
		previous: getNavItem(currentIndex - 1),
		next: getNavItem(currentIndex + 1),
	}
}
