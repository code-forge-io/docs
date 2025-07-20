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

// export function getSidebarTree(version: string) {
// 	const sectionMap = new Map<string, Section>()

// 	const sortedSections = allSections.filter((s) => s.version === version).sort((a, b) => a.position - b.position)

// 	for (const s of sortedSections) {
// 		sectionMap.set(s.slug, {
// 			title: s.title,
// 			slug: s.slug,
// 			sectionId: s.sectionId,
// 			subsections: [],
// 			documentationPages: [],
// 		})
// 	}

// 	for (const node of sectionMap.values()) {
// 		if (node.sectionId !== version) {
// 			const parent = sectionMap.get(`${version}/${node.sectionId}`)
// 			if (parent) parent.subsections.push(node)
// 		}
// 	}

// 	for (const p of allPages) {
// 		if (p.slug.startsWith(`${version}/`)) {
// 			const parent = sectionMap.get(`${version}/${p.section}`)
// 			if (parent) {
// 				parent.documentationPages.push({
// 					title: p.title,
// 					slug: p.slug,
// 				})
// 			}
// 		}
// 	}

// 	return [...sectionMap.values()].filter((s) => s.sectionId === version)
// }

export function getSidebarTree(version: string) {
	const sectionMap = new Map<string, Section>()

	// Step 1: Filter and sort sections by position
	const sortedSections = allSections.filter((s) => s.version === version).sort((a, b) => a.position - b.position)

	// Step 2: Create initial section entries
	for (const s of sortedSections) {
		sectionMap.set(s.slug, {
			title: s.title,
			slug: s.slug,
			sectionId: s.sectionId,
			subsections: [],
			documentationPages: [],
		})
	}

	// Step 3: Build tree structure (parent → subsections)
	for (const node of sectionMap.values()) {
		if (node.sectionId !== version) {
			const parent = sectionMap.get(`${version}/${node.sectionId}`)
			if (parent) {
				parent.subsections.push(node)
			}
		}
	}

	// Step 4: Assign documentation pages to matching sections
	for (const p of allPages) {
		if (p.slug.startsWith(`${version}/`)) {
			for (const section of sectionMap.values()) {
				if (section.slug.endsWith(`/${p.section}`) || section.slug === `${version}/${p.section}`) {
					section.documentationPages.push({
						title: p.title,
						slug: p.slug,
					})
					break
				}
			}
		}
	}

	// Step 5: Return only top-level sections (roots)
	return [...sectionMap.values()].filter((s) => s.sectionId === version)
}
