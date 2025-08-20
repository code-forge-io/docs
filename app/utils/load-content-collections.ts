import { getServerEnv } from "~/env.server"

export async function loadContentCollections(version: string) {
	//TODO this doesn't work the best
	const { NODE_ENV } = getServerEnv()
	if (NODE_ENV === "development") {
		const cs = await import("content-collections")
		return { allPages: cs.allPages, allSections: cs.allSections }
	}

	// TODO make this typesafe
	const basePath = `../../generated-docs/${version}/.content-collections/generated`
	const [pages, sections] = await Promise.all([import(`${basePath}/allPages.js`), import(`${basePath}/allSections.js`)])

	return {
		allPages: pages.default,
		allSections: sections.default,
	}
}
