import z from "zod"
import { fuzzySearch } from "~/server/search-index"
import { parseSearchParams } from "~/utils/parse-search-params"
import { versions } from "~/utils/versions"
import type { Route } from "./+types/search"

export const commandKSearchParamsSchema = z.object({
	query: z.string(),
	version: z.enum(versions),
})

export type CommandKSearchParams = z.infer<typeof commandKSearchParamsSchema>

export async function loader({ request }: Route.LoaderArgs) {
	const { params } = parseSearchParams(request, commandKSearchParamsSchema)
	if (!params) {
		throw new Response("Bad Request", { status: 400 })
	}

	const { query, version } = params
	if (!query) {
		return { results: [] }
	}

	try {
		const results = await fuzzySearch({ query: query.trim(), version })

		return {
			results,
		}
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: keep for debugging
		console.error("Search error:", error)
		return
	}
}
