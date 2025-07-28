import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import rehypeSlug from "rehype-slug"
import { z } from "zod"

const sectionSchema = z.object({
	title: z.string(),
})

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
		const segments = document._meta.path.split("/")
		const version = segments[0]
		const sectionId = segments.length > 1 ? segments[segments.length - 2] : segments[0]
		const cleanedSlug = segments
			.map((seg) => seg.replace(/^\d{2,}-/, "")) // removes "01-", "02-", etc.
			.join("/")
		return {
			...document,
			slug: cleanedSlug,
			sectionId,
			version,
		}
	},
})

const pageSchema = z.object({
	title: z.string(),
	summary: z.string(),
	description: z.string(),
	lastUpdated: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, {
			message: "Date must be in YYYY-MM-DD format",
		})
		.optional(),
	author: z.string().optional(),
})

/*
 * This collection defines an individual documentation page within the package documentation.
 *
 * Pages are `.mdx` files located inside section folders or their subdirectories.
 *
 * - `title`: Displayed as the page header.
 * - `summary`: A short summary of the page.
 * - `description`: A more detailed explanation of the page content.
 * - `lastUpdated`: ISO date in YYYY-MM-DD format.
 * - `author`: Author of the documentation.
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
		const slug = document._meta.path
		const segments = slug.split("/")
		const section = segments[segments.length - 2]
		// rawMdx is the content without the frontmatter, used to read headings from the mdx file and create a content tree for the table of content component
		const rawMdx = document.content.replace(/^---\s*[\r\n](.*?|\r|\n)---/, "").trim()
		const cleanedSlug = segments.map((seg) => seg.replace(/^\d{2,}-/, "")).join("/")
		return {
			...document,
			content,
			slug: cleanedSlug,
			section,
			rawMdx,
		}
	},
})

export default defineConfig({
	collections: [section, page],
})
