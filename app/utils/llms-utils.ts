import { createDomain } from "~/utils/http"
import { loadContentCollections } from "~/utils/load-content-collections"
import type { PageRecord, SectionRecord } from "../../content-collections"
import { pageUrl } from "./version-links"
import { versions } from "./versions"
import type { Version } from "./versions-utils"

async function loadVersionData(version: Version) {
	const { allPages, allSections } = await loadContentCollections(version)
	return { version, pages: allPages, sections: allSections }
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
		return `### ${label}\n\n${list.map(renderPageLink).join("\n")}`
	}

	return `\n## ${version}\n\n${Array.from(groups.entries()).map(renderSection).join("\n\n")}`
}

export async function renderLlmsTxt(request: Request, additionalData: { title: string; tagline: string }) {
	const domain = createDomain(request)

	const versionsData = await Promise.all(versions.map(loadVersionData))

	const content = versionsData
		.map(({ version, pages, sections }) => renderVersionBlock(domain, version, pages, sections))
		.join("\n")

	return [`# ${additionalData.title}`, `> ${additionalData.tagline}`, content, ""].join("\n")
}
