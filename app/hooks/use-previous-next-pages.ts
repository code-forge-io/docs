import { href, useLocation, useRouteLoaderData } from "react-router"
import type { SidebarSection } from "~/components/sidebar/sidebar"
import type { loader } from "~/root"
import { flattenSidebarItems } from "~/utils/flatten-sidebar"
import { splitSlug } from "~/utils/split-slug"
import { versions } from "~/utils/versions"

export function usePreviousNextPages(sections: SidebarSection[]) {
	const { pathname } = useLocation()
	const data = useRouteLoaderData<typeof loader>("root")
	const version = data?.version ?? versions[0]
	const flatPages = flattenSidebarItems(sections)
	const currentIndex = flatPages.findIndex((p) => pathname.endsWith(p.slug))

	const getNavItem = (index: number) => {
		const item = flatPages[index]
		if (!item) return undefined

		return {
			title: item.title,
			to: href("/:version/:section/:subsection?/:filename", { version, ...splitSlug(item.slug) }),
		}
	}

	return {
		previous: getNavItem(currentIndex - 1),
		next: getNavItem(currentIndex + 1),
	}
}
