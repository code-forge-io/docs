import type { Page } from "content-collections"
import { getPageSlug } from "~/utils/get-page-slug"
import type { SearchItem } from "./search-types"

function extractHeadings(rawMdx: string): string[] {
	const headingRegex = /^#{1,6}\s+(.+)$/gm
	const seen = new Set<string>()
	const result: string[] = []

	// biome-ignore lint/suspicious/noImplicitAnyLet: TODO remove any
	let match
	// biome-ignore lint/suspicious/noAssignInExpressions:TODO fix this
	while ((match = headingRegex.exec(rawMdx))) {
		const heading = match[1]
			.replace(/`([^`]+)`/g, "$1")
			.replace(/\*\*([^*]+)\*\*/g, "$1")
			.replace(/\*([^*]+)\*/g, "$1")
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
			.replace(/\{[^}]*\}/g, "")
			.trim()

		const lower = heading.toLowerCase()
		if (heading.length > 1 && !seen.has(lower)) {
			seen.add(lower)
			result.push(heading)
		}
	}

	return result
}

function extractTags(page: Page): string[] {
	const tags = new Set<string>()
	const normalize = (s: string) => s.replace(/^\d{2,}-/, "")

	if (page.section) tags.add(normalize(page.section))

	const dir = page._meta.directory
	if (dir) {
		for (const part of dir.split("/")) {
			if (part && part !== ".") tags.add(normalize(part))
		}
	}

	return [...tags]
}

function generateBreadcrumb(page: Page): string[] {
	const pathParts = page._meta.path.split("/")
	const breadcrumb: string[] = []

	if (/^v\d+\.\d+/.test(pathParts[0])) breadcrumb.push(pathParts[0])

	if (page.section) {
		breadcrumb.push(formatBreadcrumbPart(page.section))
	}

	if (page._meta.directory) {
		for (const part of page._meta.directory.split("/").slice(1)) {
			const formatted = formatBreadcrumbPart(part)
			if (!breadcrumb.includes(formatted)) {
				breadcrumb.push(formatted)
			}
		}
	}

	return breadcrumb
}

function formatBreadcrumbPart(part: string): string {
	return part
		.replace(/^\d+-/, "")
		.replace(/-/g, " ")
		.replace(/\b\w/g, (l) => l.toUpperCase())
}

function determineContentType(page: Page): "page" | "heading" | "section" {
	if (page._meta.fileName.startsWith("_") || page._meta.fileName === "index.mdx") return "section"
	if (page.slug.includes("#")) return "heading"
	return "page"
}

function cleanContentForSearch(raw: string): string {
	return raw
		.replace(/```[\s\S]*?```/g, "")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/\*([^*]+)\*/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/^\s*[-*+]\s+/gm, "")
		.replace(/^\s*\d+\.\s+/gm, "")
		.replace(/\n\s*\n/g, " ")
		.replace(/\s+/g, " ")
		.trim()
}

function transformToSearchIndex(pages: Page[]): SearchItem[] {
	return pages.map((page, index) => {
		const headings = extractHeadings(page.rawMdx)
		const tags = extractTags(page)
		const breadcrumb = generateBreadcrumb(page)
		const cleanContent = cleanContentForSearch(page.rawMdx)
		const category = breadcrumb[0] || formatBreadcrumbPart(page.section || "Documentation")

		return {
			id: page.slug || `page-${index}`,
			title: page.title,
			slug: getPageSlug(page),
			description: page.description || page.summary,
			content: cleanContent,
			category,
			section: page.section,
			type: determineContentType(page),
			headings,
			tags,
			breadcrumb,
			filePath: page._meta.filePath,
		}
	})
}

function createHeadingEntries(pages: Page[]): SearchItem[] {
	const entries: SearchItem[] = []
	const seen = new Set<string>()

	// biome-ignore lint/complexity/noForEach: TODO fix this
	pages.forEach((page) => {
		const base = generateBreadcrumb(page)
		const headings = extractHeadings(page.rawMdx)
		const tags = extractTags(page)

		headings.forEach((heading, i) => {
			const lower = heading.toLowerCase()
			const titleLower = page.title.toLowerCase()

			if (lower === titleLower || titleLower.includes(lower) || lower.includes(titleLower)) return

			const headingSlug = lower
				.replace(/[^a-z0-9\s-]/g, "")
				.replace(/\s+/g, "-")
				.trim()
			const id = `${page.slug}-${lower}`
			if (seen.has(id)) return
			seen.add(id)

			entries.push({
				id: `${page.slug}-heading-${i}`,
				title: heading,
				slug: `/${page.slug}#${headingSlug}`,
				description: `Section: ${heading}`,
				content: heading,
				category: base[0] || "Documentation",
				section: page.section,
				type: "heading",
				headings: [heading],
				tags,
				breadcrumb: [...base, page.title],
			})
		})
	})

	return entries
}

export function createCompleteSearchIndex(pages: Page[]): SearchItem[] {
	return [...transformToSearchIndex(pages), ...createHeadingEntries(pages)]
}
