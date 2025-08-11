import type { FuzzySearchOptions, SearchItem, SearchResult } from "../search-types"

function normalize(text: string) {
	return text.toLowerCase().trim()
}

// biome-ignore lint/suspicious/noExplicitAny: TODO remove any
function getNestedValue(obj: any, path: string) {
	const value = path.split(".").reduce((curr, key) => curr?.[key], obj)
	if (typeof value === "string") return value
	if (Array.isArray(value)) return value.join(" ")
	return ""
}

function getExactMatchScore(query: string, text: string) {
	if (!query || !text) return 0

	const q = normalize(query)
	const t = normalize(text)

	if (q.length < 3) return 0

	if (t === q) return 1
	if (t.startsWith(q)) return 0.95
	if (t.includes(q)) return 0.85

	return 0
}

function createHighlightedSnippet(text: string, query: string, maxLength = 120) {
	const t = text.trim()
	const q = normalize(query)
	const index = t.toLowerCase().indexOf(q)

	if (index === -1) return t.length > maxLength ? `${t.substring(0, maxLength)}...` : t

	const start = Math.max(0, index - Math.floor(maxLength / 2))
	const end = Math.min(t.length, index + q.length + Math.floor(maxLength / 2))
	let snippet = t.substring(start, end)

	const safeQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
	const regex = new RegExp(`(${safeQuery})`, "gi")

	snippet = snippet.replace(
		regex,
		'<mark class="bg-[var(--color-highlight-bg)] text-[var(--color-highlight-text)] rounded-sm px-0.5 font-medium">$1</mark>'
	)

	return `${start > 0 ? "..." : ""}${snippet}${end < t.length ? "..." : ""}`
}

export function fuzzySearch(
	items: SearchItem[],
	query: string,
	options: Partial<FuzzySearchOptions> = {}
): SearchResult[] {
	if (!query || query.trim().length < (options.minMatchCharLength ?? 2)) return []

	const keys = options.keys ?? ["title", "description", "content"]
	const threshold = options.threshold ?? 0.8

	const results: SearchResult[] = []

	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		let bestScore = 0
		let bestKey = ""
		let matchedText = ""

		for (const key of keys) {
			const text = getNestedValue(item, key)
			if (!text) continue

			const score = getExactMatchScore(query, text)

			if (score > bestScore && score >= threshold) {
				bestScore = score
				bestKey = key
				matchedText = text
			}
		}

		if (bestScore > 0) {
			results.push({
				item,
				score: bestScore,
				matchedKey: bestKey,
				matchedText,
				refIndex: i,
				highlightedText: createHighlightedSnippet(matchedText, query),
			})
		}
	}

	return results.sort((a, b) => b.score - a.score)
}
