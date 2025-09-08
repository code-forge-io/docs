import { splitSlug } from "./split-slug"

export function buildDocPathFromSlug(slug: string) {
	const parts = slug.split("/").filter(Boolean)

	if (parts.length === 1) {
		return `/${parts[0]}`
	}

	const { section, subsection, filename } = splitSlug(slug)
	return `/${[section, subsection, filename].filter(Boolean).join("/")}`
}
