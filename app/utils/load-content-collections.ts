import type { Version } from "~/utils/versions-utils"

type CCModule = typeof import("content-collections")

export async function loadContentCollections(version: Version) {
	//   const { NODE_ENV } = getServerEnv()

	//   if (NODE_ENV === "development") {
	//     const cc = await import("content-collections")
	//     return { allPages: cc.allPages, allSections: cc.allSections }
	//   }

	// TODO fix this
	const base = `../../generated-docs/${version}/.content-collections/generated` as const

	const cc = (await import(/* @vite-ignore */ `${base}/index.js`)) as CCModule

	return { allPages: cc.allPages, allSections: cc.allSections }
}
