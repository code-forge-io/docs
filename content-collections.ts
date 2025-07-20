import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import rehypeSlug from "rehype-slug"
import { z } from "zod"

const sectionSchema = z.object({
	title: z.string(),
	position: z.number(),
})

/*
 * This collection defines a documentation section shown in the sidebar of the package documentation.
 *
 * Each section is represented by a directory in the `content` folder and must contain an `index.md` file
 * with metadata (title and position).
 *
 * - `title`: Used as the section heading in the sidebar.
 * - `position`: Determines the order of sections in the sidebar.
 *
 * Sections must have unique `title` and `position` values.
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
		return {
			...document,
			slug: document._meta.path,
			sectionId,
			version,
		}
	},
})

const pageSchema = z.object({
	title: z.string(),
	summary: z.string(),
	description: z.string(),
	lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
		message: "Date must be in YYYY-MM-DD format",
	}),
	author: z.string(),
	position: z.number(),
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
 * - `position`: Used to order pages within a section.
 *
 * Each page must have a unique `title` and `position` within its section.
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
		return {
			...document,
			content,
			slug: document._meta.path,
			section,
			rawMdx,
		}
	},
})

export default defineConfig({
	collections: [section, page],
})
