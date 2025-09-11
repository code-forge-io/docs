import { useState } from "react"
import { useFetcher } from "react-router"
import z from "zod"
import type { Version } from "~/utils/version-resolvers"
import { versions } from "~/utils/versions"
import type { SearchResult } from "../search-types"

export const commandKSearchParamsSchema = z.object({
	query: z.string(),
	version: z.enum(versions),
})

export type CommandKSearchParams = z.infer<typeof commandKSearchParamsSchema>

function createCommandKSearchParams(params: Record<string, string>) {
	const result = commandKSearchParamsSchema.safeParse(params)
	if (!result.success) {
		// biome-ignore lint/suspicious/noConsole: keep for debugging
		console.error("Invalid parameters:", result.error)
		return { params: null }
	}

	return { params: new URLSearchParams(result.data) }
}

export function useSearch({ version }: { version: Version }) {
	const fetcher = useFetcher<{ results: SearchResult[] }>()
	const [query, setQuery] = useState("")
	//we will show results as soon as we have a non-empty query
	//this does not debounce or wait for fetcher.state === "idle".
	const results = query.trim() ? (fetcher.data?.results ?? []) : []

	function search(q: string) {
		const trimmed = q.trim()

		if (!trimmed) {
			setQuery("")
			return
		}

		setQuery(trimmed)
		const { params } = createCommandKSearchParams({ query: trimmed, version })
		if (!params) {
			// biome-ignore lint/suspicious/noConsole: keep for debugging
			console.error("Failed to create search parameters.")
			return
		}

		fetcher.load(`/search?${params.toString()}`)
	}

	return {
		results,
		search,
	}
}
