export function splitSlug(slug: string) {
	const parts = slug.split("/")
	// TODO mybe change/update this a little - this case should never happen?
	if (parts.length < 3) {
		return {
			version: parts[0] || "",
			section: "",
			fileName: parts[1] || "",
		}
	}

	const version = parts[0]
	const fileName = parts[parts.length - 1]
	const section = parts.slice(1, parts.length - 1).join("/")

	return { version, section, fileName }
}
