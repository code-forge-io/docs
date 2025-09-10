import { useState } from "react"
import { useFetcher } from "react-router"
import { commandKSearchParamsSchema } from "~/schema/command-k-search-params.schema"
import type { SearchResult } from "../search-types"

function createCommandKSearchParams(params: Record<string, string>) {
	const result = commandKSearchParamsSchema.safeParse(params)
	if (!result.success) {
		// biome-ignore lint/suspicious/noConsole: keep for debugging
		console.error("Invalid parameters:", result.error)
		return { params: null }
	}

	return { params: new URLSearchParams(result.data) }
}

export function useSearch({ version }: { version: string }) {
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
			console.error("Failed to create search parameters. Skipping fetch.")
			return
		}

		fetcher.load(`/search?${params.toString()}`)
	}

	return {
		results,
		search,
	}
}
