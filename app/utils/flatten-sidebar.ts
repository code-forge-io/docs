import type { Section } from "~/utils/create-sidebar-tree"

export function flattenSidebarItems(sections: Section[]) {
	const result: { title: string; slug: string }[] = []

	const walk = (section: Section) => {
		if (section.documentationPages.length > 0) {
			result.push(...section.documentationPages)
		}

		for (const subsection of section.subsections) {
			walk(subsection)
		}
	}

	for (const section of sections) {
		walk(section)
	}

	//TODO return an object, and in all utils as well, not just result
	return result
}
