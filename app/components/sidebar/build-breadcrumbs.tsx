import { href } from "react-router"
import { splitSlugAndAppendVersion } from "~/utils/split-slug-and-append-version"
import type { SidebarSection } from "./sidebar"

// builds a breadcrumb trail from sidebar sections based on the current pathname
export const buildBreadcrumb = (items: SidebarSection[], pathname: string) => {
	let trail: string[] = []

	const walk = (section: SidebarSection, acc: string[]) => {
		for (const doc of section.documentationPages) {
			const docPath = href("/:version/:section/:subsection?/:filename", splitSlugAndAppendVersion(doc.slug))
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
