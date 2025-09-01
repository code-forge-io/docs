import { createDomain } from "~/utils/http"
import { loadContentCollections } from "~/utils/load-content-collections"
import type { PageRecord, SectionRecord } from "../../content-collections"
import { pageUrl } from "./version-links"
import { versions } from "./versions"
import type { Version } from "./versions-utils"

async function loadVersionData(version: Version) {
	try {
		const { allPages, allSections } = await loadContentCollections(version)
		return { pages: allPages, sections: allSections }
	} catch {
		return null
	}
}

async function loadAllVersions() {
	const acc: Record<string, { pages: PageRecord[]; sections: SectionRecord[] }> = {}
	for (const v of versions) {
		const loaded = await loadVersionData(v)
		if (loaded) acc[v] = loaded
	}
	return acc
}

function buildSectionTitles(sections: SectionRecord[]) {
	return new Map(sections.map((s) => [s.slug.split("/").pop() || "", s.title]))
}

function groupPagesByFolder(pages: PageRecord[]) {
	const groups = new Map<string, PageRecord[]>()

	for (const p of pages) {
		const id = p.section ?? p._meta?.path?.split("/")[0]
		if (!id) continue

		let list = groups.get(id)
		if (!list) {
			list = []
			groups.set(id, list)
		}
		list.push(p)
	}

	return groups
}

function renderVersionBlock(domain: string, version: string, pages: PageRecord[], sections: SectionRecord[]) {
	if (!pages.length) return `## ${version}\n\n_No pages found._`

	const sectionTitles = buildSectionTitles(sections)
	const groups = groupPagesByFolder(pages)

	const renderPageLink = (p: PageRecord) => {
		const url = pageUrl(domain, version, p.slug)
		const note = p.summary || p.description || ""
		return `- [${p.title}](${url})${note ? `: ${note}` : ""}`
	}

	const renderSection = ([id, list]: [string, PageRecord[]]) => {
		const label = sectionTitles.get(id) ?? id
		const lines = list.map(renderPageLink).join("\n")
		return `### ${label}\n\n${lines}`
	}

	const blocks = Array.from(groups.entries()).map(renderSection).join("\n\n")

	return `\n## ${version}\n\n${blocks}`
}

export async function renderLlmsTxt(request: Request, additionalData: { title: string; tagline: string }) {
	const domain = createDomain(request)
	const versionsData = await loadAllVersions()
	const project = additionalData.title
	const tagline = additionalData.tagline

	const content = Object.keys(versionsData)
		.map((version) => {
			const { pages, sections } = versionsData[version]
			return renderVersionBlock(domain, version, pages, sections)
		})
		.join("\n")

	return [`# ${project}`, `> ${tagline}`, content, ""].join("\n")
}
