import { allPages, allSections } from "content-collections"
//TODO refactor this a little bit
export type SidebarSection = {
	title: string
	slug: string
	sectionId: string
	subsections: SidebarSection[]
	documentationPages: {
		title: string
		slug: string
	}[]
}

export function getSidebarTree(version: string) {
	const sectionMap = new Map<string, SidebarSection>()

	const sortedSections = allSections.filter((s) => s.version === version).sort((a, b) => a.position - b.position)

	for (const s of sortedSections) {
		sectionMap.set(s.slug, {
			title: s.title,
			slug: s.slug,
			sectionId: s.sectionId,
			subsections: [],
			documentationPages: [],
		})
	}

	for (const node of sectionMap.values()) {
		if (node.sectionId !== version) {
			const parent = sectionMap.get(`${version}/${node.sectionId}`)
			if (parent) {
				parent.subsections.push(node)
			}
		}
	}

	const sectionSlugToSection = new Map<string, SidebarSection>()
	for (const section of sectionMap.values()) {
		sectionSlugToSection.set(section.slug, section)
		sectionSlugToSection.set(section.slug.split("/").slice(-1).join(""), section)
	}

	for (const p of allPages) {
		if (p.slug.startsWith(`${version}/`)) {
			const section = sectionSlugToSection.get(`${version}/${p.section}`) ?? sectionSlugToSection.get(p.section)
			if (section) {
				section.documentationPages.push({
					title: p.title,
					slug: p.slug,
				})
			}
		}
	}

	return [...sectionMap.values()].filter((s) => s.sectionId === version)
}
