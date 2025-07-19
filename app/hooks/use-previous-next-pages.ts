import { useMemo } from "react"
import { href, useLocation } from "react-router"
import type { Section } from "~/utils/create-sidebar-tree"
import { flattenSidebarItems } from "~/utils/flatten-sidebar"
import { splitSlug } from "~/utils/split-slug"

export function usePreviousNextPages(sections: Section[]) {
	const { pathname } = useLocation()

	const flatPages = useMemo(() => flattenSidebarItems(sections), [sections])
	const currentIndex = flatPages.findIndex((p) => pathname.endsWith(p.slug))

	const getNavItem = (index: number) => {
		const item = flatPages[index]
		if (!item) return undefined

		const { version, section, fileName } = splitSlug(item.slug)
		return {
			title: item.title,
			to: href("/docs/:version/:section/:filename", {
				version,
				section,
				filename: fileName,
			}),
		}
	}

	return {
		previous: getNavItem(currentIndex - 1),
		next: getNavItem(currentIndex + 1),
	}
}
