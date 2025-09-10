import { href } from "react-router"
import { splitSlug } from "~/utils/split-slug"

export function getFilenameFromSlug(slug: string) {
	return slug.split("/").filter(Boolean).at(-1) ?? slug
}

export function buildStandaloneTo(version: string, slug: string) {
	const filename = getFilenameFromSlug(slug)
	// route: /:version?/:filename
	return href("/:version?/:filename", { version, filename })
}

export function buildSectionedTo(version: string, slug: string) {
	const { section, subsection, filename } = splitSlug(slug)
	// route: /:version/:section/:subsection?/:filename
	return href("/:version/:section/:subsection?/:filename", {
		version,
		section,
		subsection,
		filename,
	})
}
