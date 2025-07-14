import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import { z } from "zod"

const sectionSchema = z.object({
	title: z.string(),
	position: z.number(),
})

/*
 * This collection defines documentation section shown in the sidebar of the package documentation
 * It includes the title of the section and its position in the sidebar.
 * The position is used to order the sections in the sidebar.
 * The title is used as the section header.
 * Every section must have a unique title and position.
 * Sections are represented as directories in the content directory.
 * Each section contains an index.md file that contains the metadata (title and position) for the section.
 * The index.md file is used to generate the sidebar.
 * Each section can have multiple .mdx files or folders with .mdx files inside it and index.md file.
 */
//FIXME for now sections are not clicable, but in future instead of index.md we can make to accept index.mdx so the section itself can have content
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
	position: z.number().optional(),
})

/*
 * This collection defines a documentation page shown in the package's documentation.
 * It includes the title, summary, description, last updated date, author, and position of the page.
 * The position is used to order the pages in the sidebar or in the sidebar's sections.
 * The title is used as the page header.
 * Each page is represented as a .mdx file inside a section directory or inside a subdirectory of a section.
 * Each page must have a unique title and position within its section.
 */
const page = defineCollection({
	name: "page",
	directory: "content",
	include: "**/**/*.mdx",
	schema: pageSchema,
	transform: async (document, context) => {
		const content = await compileMDX(context, document)
		const slug = document._meta.path
		const segments = slug.split("/")
		const section = segments[segments.length - 2]
		return {
			...document,
			content,
			slug: document._meta.path,
			section,
		}
	},
})

export default defineConfig({
	collections: [section, page],
})
