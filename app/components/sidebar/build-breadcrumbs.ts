import type { Page } from "content-collections"
import type { SidebarSection } from "~/utils/create-sidebar-tree"
import { buildDocPathFromSlug } from "~/utils/path-builders"

export const buildBreadcrumbs = (
	items: SidebarSection[],
	pathname: string,
	documentationPages: Pick<Page, "title" | "slug">[] = []
) => {
	// for standalone pages
	for (const page of documentationPages) {
		const path = buildDocPathFromSlug(page.slug)
		const docPath = `/${path}`
		if (docPath === pathname) {
			return [page.title]
		}
	}

	// for sectioned pages
	let trail: string[] = []

	const walk = (section: SidebarSection, acc: string[]): boolean => {
		for (const doc of section.documentationPages) {
			const docPath = buildDocPathFromSlug(doc.slug)
			if (docPath === pathname) {
				trail = [...acc, section.title, doc.title]
				return true
			}
		}

		for (const sub of section.subsections) {
			if (walk(sub, [...acc, section.title])) return true
		}
		return false
	}

	for (const root of items) {
		if (walk(root, [])) break
	}

	return trail
}
