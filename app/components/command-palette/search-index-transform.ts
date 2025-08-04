import type { SearchItem } from "./search-types"

interface ContentCollectionPage {
	title: string
	summary?: string
	description?: string
	content: string
	rawMdx: string
	_meta: {
		filePath: string
		fileName: string
		directory: string
		extension: string
		path: string
	}
	slug: string
	section?: string
	lastUpdated?: string
	author?: string
	tags?: string[]
	[key: string]: unknown
}

/**
 * Extract all Markdown headings (h1-h6)
 */
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

/**
 * Derive tags from frontmatter, directory, section, and content
 */
// export function extractTags(page: ContentCollectionPage): string[] {
// 	const tagSet = new Set<string>(page.tags || [])

// 	const addTag = (tag: string) => {
// 		if (tag) tagSet.add(tag.replace(/^\d+-/, ""))
// 	}

// 	addTag(page.section || "")
// 	page._meta.directory?.split("/").forEach((part) => part && part !== "." && addTag(part))

// 	const content = page.rawMdx.toLowerCase()
// 	const implicitTags = [
// 		"installation",
// 		"setup",
// 		"configuration",
// 		"api",
// 		"guide",
// 		"tutorial",
// 		"troubleshooting",
// 		"examples",
// 		"reference",
// 		"getting-started",
// 	]

// 	implicitTags.forEach((tag) => {
// 		if (content.includes(tag.replace("-", " ")) || content.includes(tag)) {
// 			tagSet.add(tag)
// 		}
// 	})

// 	return Array.from(tagSet)
// }

function extractTags(page: ContentCollectionPage): string[] {
	const tagSet = new Set<string>(page.tags || [])

	const addTag = (tag: string) => {
		if (tag) tagSet.add(tag.replace(/^\d+-/, ""))
	}

	addTag(page.section || "")
	// biome-ignore lint/complexity/noForEach:TODO fix this
	page._meta.directory?.split("/").forEach((part) => part && part !== "." && addTag(part))

	return Array.from(tagSet)
}

/**
 * Build a breadcrumb trail for the page
 */
function generateBreadcrumb(page: ContentCollectionPage): string[] {
	const pathParts = page._meta.path.split("/")
	const breadcrumb: string[] = []

	// Add version if present
	if (/^v\d+\.\d+/.test(pathParts[0])) breadcrumb.push(pathParts[0])

	// Add section
	if (page.section) {
		breadcrumb.push(formatBreadcrumbPart(page.section))
	}

	// Add directory structure
	// biome-ignore lint/complexity/noForEach: TODO fix this
	page._meta.directory
		?.split("/")
		.slice(1)
		.forEach((part) => {
			const formatted = formatBreadcrumbPart(part)
			if (!breadcrumb.includes(formatted)) breadcrumb.push(formatted)
		})

	return breadcrumb
}

function formatBreadcrumbPart(part: string): string {
	return part
		.replace(/^\d+-/, "")
		.replace(/-/g, " ")
		.replace(/\b\w/g, (l) => l.toUpperCase())
}

/**
 * Infer content type from metadata
 */
function determineContentType(page: ContentCollectionPage): "page" | "heading" | "section" {
	if (page._meta.fileName.startsWith("_") || page._meta.fileName === "index.mdx") return "section"
	if (page.slug.includes("#")) return "heading"
	return "page"
}

/**
 * Strip MDX for lightweight search content
 */
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

/**
 * Main transform: content pages → SearchItem[]
 */
function transformToSearchIndex(pages: ContentCollectionPage[]): SearchItem[] {
	return pages.map((page, index) => {
		const headings = extractHeadings(page.rawMdx)
		const tags = extractTags(page)
		const breadcrumb = generateBreadcrumb(page)
		const cleanContent = cleanContentForSearch(page.rawMdx)
		const category = breadcrumb[0] || formatBreadcrumbPart(page.section || "Documentation")

		return {
			id: page.slug || `page-${index}`,
			title: page.title,
			slug: `/${page.slug}`,
			description: page.description || page.summary,
			content: cleanContent,
			category,
			section: page.section,
			type: determineContentType(page),
			headings,
			tags,
			breadcrumb,
			lastUpdated: page.lastUpdated,
			author: page.author,
			filePath: page._meta.filePath,
		}
	})
}

/**
 * Create extra entries for each heading
 */
// TODO refactor this and rename it
function createHeadingEntries(pages: ContentCollectionPage[]): SearchItem[] {
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
				// lastUpdated: page.lastUpdated,
				// author: page.author,
				// filePath: page._meta.filePath,
			})
		})
	})

	return entries
}

/**
 * All entries: pages + headings
 */
export function createCompleteSearchIndex(pages: ContentCollectionPage[]): SearchItem[] {
	return [...transformToSearchIndex(pages), ...createHeadingEntries(pages)]
}
