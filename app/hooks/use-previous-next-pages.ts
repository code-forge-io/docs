import { href, useLocation } from "react-router"
import type { SidebarSection } from "~/components/sidebar/sidebar"
import { flattenSidebarItems } from "~/utils/flatten-sidebar"
import { splitSlugAndAppendVersion } from "~/utils/split-slug-and-append-version"

export function usePreviousNextPages(sections: SidebarSection[]) {
	const { pathname } = useLocation()

	const flatPages = flattenSidebarItems(sections)
	const currentIndex = flatPages.findIndex((p) => pathname.endsWith(p.slug))

	const getNavItem = (index: number) => {
		const item = flatPages[index]
		if (!item) return undefined

		return {
			title: item.title,
			to: href("/:version/:section/:subsection?/:filename", splitSlugAndAppendVersion(item.slug)),
		}
	}

	return {
		previous: getNavItem(currentIndex - 1),
		next: getNavItem(currentIndex + 1),
	}
}
