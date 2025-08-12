import { z } from "zod"

export const VersionSpecSchema = z.union([
	z.object({ exact: z.array(z.string()).min(1) }),
	z.object({ ranges: z.array(z.string()).min(1) }),
	z.object({ latest: z.number().int().positive() }),
])

export const DocsConfigSchema = z.object({
	versions: VersionSpecSchema,
	content: z.object({
		docsDir: z.string().default("docs"),
	}),
	output: z.object({
		baseDir: z.string().default("generated-docs"),
	}),
})

export type DocsConfig = z.infer<typeof DocsConfigSchema>

export function defineDocsConfig<T extends DocsConfig>(cfg: T) {
	return cfg
}
