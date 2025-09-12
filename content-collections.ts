import { defineCollection, defineConfig } from "@content-collections/core"
import { compileMDX } from "@content-collections/mdx"
import rehypeSlug from "rehype-slug"
import { z } from "zod"

const sectionSchema = z.object({
	title: z.string(),
})
const pageSchema = z.object({
	title: z.string(),
	summary: z.string(),
	description: z.string(),
})
const metaSchema = z.object({ path: z.string() }).partial().optional()

const outputBaseSchema = z.object({
	slug: z.string(),
	_meta: metaSchema,
})

const sectionOutputSchema = sectionSchema.extend(outputBaseSchema.shape)

const pageOutputSchema = pageSchema.extend({
	...outputBaseSchema.shape,
	section: z.string().optional(),
	rawMdx: z.string(),
	content: z.unknown(),
})

export type Section = z.infer<typeof sectionOutputSchema>
export type Page = z.infer<typeof pageOutputSchema>

/**
 * Removes leading number prefixes like "01-", "02-" from each path segment.
 */
const cleanSlug = (path: string) =>
	path
		.split("/")
		.map((seg) => seg.replace(/^\d{2,}-/, ""))
		.join("/")

/*
 * This collection defines a documentation section shown in the sidebar of the package documentation.
 *
 * Each section is represented by a directory in the `content` folder and must contain an `index.md` file
 * with metadata (title).
 */
const section = defineCollection({
	name: "section",
	directory: "content",
	include: "**/index.md",
	schema: sectionSchema,
	transform: (document) => {
		const relativePath = document._meta.path.split("/").filter(Boolean).join("/")
		const slug = cleanSlug(relativePath)
		return { ...document, slug }
	},
})

/*
 * This collection defines an individual documentation page within the package documentation.
 *
 * Pages are `.mdx` files located inside section folders or their subdirectories.
 */
const page = defineCollection({
	name: "page",
	directory: "content",
	include: "**/**/*.mdx",
	schema: pageSchema,
	transform: async (document, context) => {
		const relativePath = document._meta.path.split("/").filter(Boolean).join("/")
		const slug = cleanSlug(relativePath)
		const content = await compileMDX(context, document, {
			rehypePlugins: [rehypeSlug],
		})

		// rawMdx is the content without the frontmatter, used to read headings from the mdx file and create a content tree for the table of content component
		const rawMdx = document.content.replace(/^---\s*[\r\n](.*?|\r|\n)---/, "").trim()
		return {
			...document,
			content,
			slug,
			section: slug.split("/")[0] ?? "",
			rawMdx,
		}
	},
})

export default defineConfig({
	collections: [section, page],
})
