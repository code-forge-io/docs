import type { Page } from "content-collections"
import { href, useLocation, useRouteLoaderData } from "react-router"
import type { SidebarSection } from "~/components/sidebar/sidebar"
import type { loader } from "~/root"
import { flattenSidebarItems } from "~/utils/flatten-sidebar"
import { splitSlug } from "~/utils/split-slug"
import { versions } from "~/utils/versions"

function buildDocHref(slug: string, version: string) {
	const parts = slug.split("/").filter(Boolean)
	if (parts.length === 1) {
		const filename = parts[0]
		return href("/:version?/:filename", { version, filename })
	}
	const { section, subsection, filename } = splitSlug(slug)
	return href("/:version/:section/:subsection?/:filename", {
		version,
		section,
		subsection,
		filename,
	})
}

export function usePreviousNextPages(sections: SidebarSection[], standalonePages: Page[] = []) {
	const { pathname } = useLocation()
	const data = useRouteLoaderData<typeof loader>("root")
	const version = data?.version ?? versions[0]

	// Keep your existing flattening for sections, then prepend standalone pages
	// (you said standalone should appear first).
	const flatFromSections = flattenSidebarItems(sections)
	const flatStandalone = standalonePages.map((p) => ({ title: p.title, slug: p.slug }))
	const flatPages = [...flatStandalone, ...flatFromSections]

	// Find current by slug suffix (works for both /:version?/:filename and sectioned routes)
	const currentIndex = flatPages.findIndex((p) => pathname.endsWith(p.slug))

	const getNavItem = (index: number) => {
		const item = flatPages[index]
		if (!item) return undefined
		return {
			title: item.title,
			to: buildDocHref(item.slug, version),
		}
	}

	return {
		previous: getNavItem(currentIndex - 1),
		next: getNavItem(currentIndex + 1),
	}
}
