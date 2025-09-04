import { useCallback, useEffect, useMemo, useState } from "react"
import { COMMAND_K_SEARCH_HISTORY, getStorageItem, removeStorageItem, setStorageItem } from "~/utils/local-storage"
import { normalizeVersion } from "~/utils/version-resolvers"
import type { HistoryItem } from "../search-types"

const MAX_HISTORY_ITEMS = 10

// we build a unique key per version
function keyFor(version: string) {
	const { version: v } = normalizeVersion(version)
	return `${COMMAND_K_SEARCH_HISTORY}-${v}`
}

export const useSearchHistory = (version: string) => {
	const storageKey = useMemo(() => keyFor(version), [version])
	const [history, setHistory] = useState<HistoryItem[]>([])

	useEffect(() => {
		try {
			const stored = getStorageItem(storageKey)
			if (stored) {
				const parsed = JSON.parse(stored)
				if (Array.isArray(parsed)) setHistory(parsed)
				else setHistory([])
			} else {
				setHistory([])
			}
		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: keep for debugging
			console.warn("Failed to load search history:", error)
			setHistory([])
		}
	}, [storageKey])

	useEffect(() => {
		try {
			setStorageItem(storageKey, JSON.stringify(history))
		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: keep for debugging
			console.warn("Failed to save search history:", error)
		}
	}, [history, storageKey])

	const addToHistory = useCallback((item: HistoryItem) => {
		setHistory((prev) => {
			const existingIndex = prev.findIndex((h) => h.id === item.id)

			if (existingIndex >= 0) {
				const existing = prev[existingIndex]
				const updated: HistoryItem = {
					...existing,
					type: item.type ?? existing.type,
					title: item.title ?? existing.title,
					subtitle: item.subtitle ?? existing.subtitle,
					paragraphs: item.paragraphs ?? existing.paragraphs,
					highlightedText: item.highlightedText ?? existing.highlightedText,
				}

				return [updated, ...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)].slice(0, MAX_HISTORY_ITEMS)
			}

			const newItem: HistoryItem = {
				...item,
			}

			return [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS)
		})
	}, [])

	const clearHistory = useCallback(() => {
		setHistory([])
		removeStorageItem(storageKey)
	}, [storageKey])

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
