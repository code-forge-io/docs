import { useCallback, useEffect, useState } from "react"
import type { SearchItem } from "../search-types"

interface HistoryItem extends SearchItem {
	clickedAt: number
	clickCount: number
}

const STORAGE_KEY = "commandk-search-history"
const MAX_HISTORY_ITEMS = 10

export const useSearchHistory = () => {
	const [history, setHistory] = useState<HistoryItem[]>([])

	// Load history from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				const parsed = JSON.parse(stored)
				setHistory(parsed)
			}
		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: <explanation>
			console.warn("Failed to load search history:", error)
		}
	}, [])

	// Save history to localStorage whenever it changes
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: <explanation>
			console.warn("Failed to save search history:", error)
		}
	}, [history])

	const addToHistory = useCallback((item: SearchItem) => {
		setHistory((prev) => {
			// Check if item already exists in history
			const existingIndex = prev.findIndex((h) => h.id === item.id)

			if (existingIndex >= 0) {
				// Update existing item - move to top and increment count
				const existing = prev[existingIndex]
				const updated = {
					...existing,
					clickedAt: Date.now(),
					clickCount: existing.clickCount + 1,
				}

				return [updated, ...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)]
			}
			// Add new item to top
			const newItem: HistoryItem = {
				...item,
				clickedAt: Date.now(),
				clickCount: 1,
			}

			return [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS)
		})
	}, [])

	const clearHistory = useCallback(() => {
		setHistory([])
		localStorage.removeItem(STORAGE_KEY)
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
