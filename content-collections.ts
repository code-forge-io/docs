import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import rehypeSlug from "rehype-slug"
import { z } from "zod"

const sectionSchema = z.object({
	title: z.string(),
})

/**
 * Removes leading number prefixes like "01-", "02-" from each path segment.
 */
const cleanSlug = (path: string) =>
	path
		.split("/")
		.map((seg) => seg.replace(/^\d{2,}-/, "")) // removes "01-", "02-", etc.
		.join("/")

/**
 * Extracts the version from a path (assumes version is the first segment).
 */
const getVersion = (path: string) => path.split("/")[0]

/**
 * Extracts the section ID (usually the parent folder of index.md or the last folder).
 */
const getSectionId = (path: string) => {
	const segments = path.split("/")
	return segments.length > 1 ? segments[segments.length - 2] : segments[0]
}

/**
 * Extracts the section name (usually the second-to-last segment).
 */
const getSectionName = (path: string) => {
	const segments = path.split("/")
	return segments[segments.length - 2] || ""
}

/*
 * This collection defines a documentation section shown in the sidebar of the package documentation.
 *
 * Each section is represented by a directory in the `content` folder and must contain an `index.md` file
 * with metadata (title).
 *
 * - `title`: Used as the section heading in the sidebar.
 *
 * Sections must have unique `title` value.
 *
 * Sections can contain multiple `.mdx` pages or subdirectories with their own `.mdx` pages and `index.md` files.
 */
const section = defineCollection({
	name: "section",
	directory: "content",
	include: "**/index.md",
	schema: sectionSchema,
	transform: (document) => {
		return {
			...document,
			slug: cleanSlug(document._meta.path),
			sectionId: getSectionId(document._meta.path),
			version: getVersion(document._meta.path),
		}
	},
})

const pageSchema = z.object({
	title: z.string(),
	summary: z.string(),
	description: z.string(),
})

/*
 * This collection defines an individual documentation page within the package documentation.
 *
 * Pages are `.mdx` files located inside section folders or their subdirectories.
 *
 * - `title`: Displayed as the page header.
 * - `summary`: A short summary of the page.
 * - `description`: A more detailed explanation of the page content.
 *
 * Each page must have a unique `title` within its section.
 */
const page = defineCollection({
	name: "page",
	directory: "content",
	include: "**/**/*.mdx",
	schema: pageSchema,
	transform: async (document, context) => {
		const content = await compileMDX(context, document, {
			rehypePlugins: [rehypeSlug],
		})
		// rawMdx is the content without the frontmatter, used to read headings from the mdx file and create a content tree for the table of content component
		const rawMdx = document.content.replace(/^---\s*[\r\n](.*?|\r|\n)---/, "").trim()
		return {
			...document,
			content,
			slug: cleanSlug(document._meta.path),
			section: getSectionName(document._meta.path),
			rawMdx,
		}
	},
})

export default defineConfig({
	collections: [section, page],
})
