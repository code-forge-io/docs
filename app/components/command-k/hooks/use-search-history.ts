import { useCallback, useEffect, useState } from "react"
import { COMMAND_K_SEARCH_HISTORY, getStorageItem, removeStorageItem, setStorageItem } from "~/utils/local-storage"
import type { HistoryItem, MatchType, SearchDoc } from "../search-types"

const MAX_HISTORY_ITEMS = 10

export const useSearchHistory = () => {
	const [history, setHistory] = useState<HistoryItem[]>([])

	useEffect(() => {
		try {
			const stored = getStorageItem(COMMAND_K_SEARCH_HISTORY)
			if (stored) {
				const parsed = JSON.parse(stored)
				setHistory(parsed)
			}
		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: keep for debugging
			console.warn("Failed to load search history:", error)
		}
	}, [])

	useEffect(() => {
		try {
			setStorageItem(COMMAND_K_SEARCH_HISTORY, JSON.stringify(history))
		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: keep for debugging
			console.warn("Failed to save search history:", error)
		}
	}, [history])

	const addToHistory = useCallback(
		(item: SearchDoc & { highlightedText?: string; version?: string; type?: MatchType; slug?: string }) => {
			setHistory((prev) => {
				const existingIndex = prev.findIndex((h) => h.id === item.id)

				if (existingIndex >= 0) {
					const existing = prev[existingIndex]
					const updated: HistoryItem = {
						...existing,
						version: item.version ?? existing.version,
						type: item.type ?? existing.type,
						slug: item.slug ?? existing.slug,
						highlightedText: item.highlightedText ?? existing.highlightedText,
					}

					return [updated, ...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)]
				}

				const newItem: HistoryItem = {
					...item,
				}

				return [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS)
			})
		},
		[]
	)

	const clearHistory = useCallback(() => {
		setHistory([])
		removeStorageItem(COMMAND_K_SEARCH_HISTORY)
	}, [])

	const removeFromHistory = useCallback((itemId: string) => {
		setHistory((prev) => prev.filter((item) => item.id !== itemId))
	}, [])

	return {
		history,
		addToHistory,
		clearHistory,
		removeFromHistory,
	}
}
