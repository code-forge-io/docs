import { allPages, allSections } from "content-collections"
import type { SidebarSection } from "~/components/sidebar"
//TODO refactor this a little bit
//TODO this doesnt't work with subsections

export function getSidebarTree(version: string) {
	const sectionMap = new Map<string, SidebarSection>()

	const filteredSections = allSections.filter((s) => s.version === version)

	for (const s of filteredSections) {
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
			const cleanedSection = p.section.replace(/^\d{2,}-/, "")
			const section =
				sectionSlugToSection.get(`${version}/${cleanedSection}`) ?? sectionSlugToSection.get(cleanedSection)
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
