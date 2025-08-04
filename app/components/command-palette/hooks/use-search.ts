import { startTransition, useEffect, useState } from "react"

const SEARCH_DEBOUNCE_MS = 150
// biome-ignore lint/suspicious/noExplicitAny: TODO remove any
export const useSearch = (fuzzySearch: any, maxResults: number, onSearchHistoryAdd: (item: any) => void) => {
	const [query, setQuery] = useState("")
	// biome-ignore lint/suspicious/noExplicitAny: TODO remove any
	const [results, setResults] = useState<any[]>([])

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

	// biome-ignore lint/suspicious/noExplicitAny: TODO remove any
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
