import { getServerEnv } from "~/env.server"
// import docsConfig from "../../documentation.config"

// TODO make this typesafe
export async function loadContentCollections(version: string) {
	const { NODE_ENV } = getServerEnv()
	if (NODE_ENV === "development") {
		const cs = await import("content-collections")
		return { allPages: cs.allPages, allSections: cs.allSections }
	}

	const basePath = `/generated-docs/${version}/.content-collections/generated`
	const [pages, sections] = await Promise.all([import(`${basePath}/allPages.js`), import(`${basePath}/allSections.js`)])

	return {
		allPages: pages,
		allSections: sections,
	}
}
