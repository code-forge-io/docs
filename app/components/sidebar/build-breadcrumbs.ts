import type { Page } from "content-collections"
import { splitSlug } from "~/utils/split-slug"
import type { SidebarSection } from "./sidebar"

export const buildBreadcrumbs = (
	items: SidebarSection[],
	pathname: string,
	documentationPages: Pick<Page, "title" | "slug">[] = []
) => {
	// 1) Standalone pages: /:filename
	for (const page of documentationPages) {
		const filename = page.slug.split("/").filter(Boolean).at(-1) ?? page.slug
		const docPath = `/${filename}`
		if (docPath === pathname) {
			return [page.title]
		}
	}

	// 2) Sectioned pages: /:section/:subsection?/:filename
	let trail: string[] = []

	const walk = (section: SidebarSection, acc: string[]): boolean => {
		for (const doc of section.documentationPages) {
			const { section: sec, subsection, filename } = splitSlug(doc.slug)
			const docPath = `/${[sec, subsection, filename].filter(Boolean).join("/")}`
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
