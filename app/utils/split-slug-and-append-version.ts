import { useCurrentVersion } from "./versions-utils"

export function splitSlugAndAppendVersion(slug: string) {
	const parts = slug.split("/").filter(Boolean)
	const version = useCurrentVersion()
	if (parts.length === 2) {
		const [section, filename] = parts
		return { section, filename, version }
	}

	if (parts.length === 3) {
		const [section, subsection, filename] = parts
		return { section, subsection, filename, version }
	}

	throw new Error(
		`Invalid slug format: expected "section/page" or "section/subsection/page" but got ${parts.length} segments — slug: ${slug}`
	)
}
