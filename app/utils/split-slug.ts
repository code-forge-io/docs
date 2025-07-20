export function splitSlug(slug: string) {
	const parts = slug.split("/")

	if (parts.length < 3 || parts.length > 4) {
		throw new Error(`Invalid slug format: expected 3 or 4 segments but got ${parts.length} — slug: ${slug}`)
	}

	const [version, section, third, fourth] = parts

	return {
		version,
		section,
		subsection: parts.length === 4 ? third : undefined,
		fileName: parts.length === 4 ? fourth : third,
	}
}
