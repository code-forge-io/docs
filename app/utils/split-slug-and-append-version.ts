import { getCurrentVersion } from "./version-resolvers"

export function splitSlugAndAppendVersion(slug: string) {
	const parts = slug.split("/").filter(Boolean)
	const { version } = getCurrentVersion()
	if (parts.length === 2) {
		const [section, filename] = parts
		return { version, section, filename }
	}

	if (parts.length === 3) {
		const [section, subsection, filename] = parts
		return { version, section, subsection, filename }
	}

	throw new Error(
		`Invalid slug format: expected "section/page" or "section/subsection/page" but got ${parts.length} segments — slug: ${slug}`
	)
}
