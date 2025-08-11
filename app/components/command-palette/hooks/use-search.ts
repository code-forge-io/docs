import { startTransition, useEffect, useState } from "react"
import type { SearchResult } from "../search-types"

const SEARCH_DEBOUNCE_MS = 150

// biome-ignore lint/suspicious/noExplicitAny: TODO
export const useSearch = (fuzzySearch: any, maxResults: number, onSearchHistoryAdd: (item: any) => void) => {
	const [query, setQuery] = useState("")
	const [results, setResults] = useState<SearchResult[]>([])

	useEffect(() => {
		if (!query.trim()) {
			setResults([])
			return
		}

		const timeoutId = setTimeout(() => {
			startTransition(() => {
				const searchResults = fuzzySearch.search(query)
				setResults(searchResults.slice(0, maxResults))
			})
		}, SEARCH_DEBOUNCE_MS)

		return () => clearTimeout(timeoutId)
	}, [query, fuzzySearch, maxResults])

	// biome-ignore lint/suspicious/noExplicitAny: TODO
	const handleSelect = (item: any) => {
		onSearchHistoryAdd(item)
		setQuery("")
	}

	const clearQuery = () => {
		setQuery("")
	}

	return {
		query,
		setQuery,
		results,
		handleSelect,
		clearQuery,
	}
}
