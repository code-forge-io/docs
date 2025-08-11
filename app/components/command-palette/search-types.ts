export interface SearchItem {
	id: string
	title: string
	slug: string
	description?: string
	content?: string
	category?: string
	section?: string
	type: "page" | "heading" | "section"
	headings?: string[]
	tags?: string[]
	breadcrumb?: string[]
}

export interface SearchResult {
	item: SearchItem
	score: number
	matchedKey: string
	matchedText: string
	highlightedText: string
	refIndex: number
}

export interface FuzzySearchOptions {
	keys: string[]
	threshold: number
	includeScore: boolean
	minMatchCharLength: number
}
