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

		return {
			title: item.title,
			to: href("/:version/:section/:subsection?/:filename", splitSlug(item.slug)),
		}
	}

	return {
		previous: getNavItem(currentIndex - 1),
		next: getNavItem(currentIndex + 1),
	}
}
