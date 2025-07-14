import { allPages, allSections } from "content-collections"
// TODO maybe refactor this a little bit

export type Section = {
	title: string
	slug: string
	sectionId: string
	subsections: Section[]
	documentationPages: {
		title: string
		slug: string
	}[]
}

export function getSidebarTree(version: string) {
	const sectionMap = new Map<string, Section>()

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
			if (parent) parent.subsections.push(node)
		}
	}

	for (const p of allPages) {
		if (p.slug.startsWith(`${version}/`)) {
			const parent = sectionMap.get(`${version}/${p.section}`)
			if (parent) {
				parent.documentationPages.push({
					title: p.title,
					slug: p.slug,
				})
			}
		}
	}

	return [...sectionMap.values()].filter((s) => s.sectionId === version)
}
