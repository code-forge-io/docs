import { createSearchIndex } from "~/components/command-k/create-search-index"
import { fuzzySearch } from "~/components/command-k/hooks/use-fuzzy-search"
import { loadContentCollections } from "~/utils/load-content-collections"
import { parseCommandKSearchParams } from "~/utils/parse-command-k-search-params"
import type { Route } from "./+types/search"

export async function loader({ request }: Route.LoaderArgs) {
	const { params } = parseCommandKSearchParams(request)
	if (!params) {
		throw new Response("Bad Request", { status: 400 })
	}

	const { query, version } = params
	if (!query) {
		return { results: [] }
	}

	try {
		const { allPages } = await loadContentCollections(version)
		const searchIndex = createSearchIndex(allPages)

		const results = fuzzySearch(searchIndex, query.trim())

		return {
			results,
			query: query.trim(),
			version,
			total: results.length,
		}
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: keep for debugging
		console.error("Search error:", error)
		return
	}
}
