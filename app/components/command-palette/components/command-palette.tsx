import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Modal } from "~/components/modal"
import { fuzzySearch } from "../hooks/use-fuzzy-search"
import { useKeyboardNavigation } from "../hooks/use-keyboard-navigation"
import { useModalState } from "../hooks/use-modal-state"
import { useSearchHistory } from "../hooks/use-search-history"
import type { SearchItem, SearchResult } from "../search-types"
import { EmptyState } from "./empty-state"
import { ResultsFooter } from "./results-footer"
import { SearchHistory } from "./search-history"
import { SearchInput } from "./search-input"
import { SearchResultRow } from "./search-result"
import { TriggerButton } from "./trigger-button"

interface CommandPaletteProps {
	searchIndex: SearchItem[]
	placeholder?: string
}

export const CommandPalette = ({ searchIndex, placeholder }: CommandPaletteProps) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const [query, setQuery] = useState("")

	const inputRef = useRef<HTMLInputElement>(null)

	const { isOpen, openModal, closeModal } = useModalState()
	const { history, addToHistory, clearHistory, removeFromHistory } = useSearchHistory()

	const results = fuzzySearch(searchIndex, query, {
		threshold: 0.8,
		minMatchCharLength: 3,
	})

	const handleClose = () => {
		closeModal()
		setQuery("")
	}

	function slugifyHeading(text: string) {
		return text
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.trim()
	}

	function findBestMatchingHeading(headings: string[] | undefined, q: string) {
		if (!headings || headings.length === 0 || !q) return undefined
		const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
		let best: { heading: string; score: number } | undefined
		for (const h of headings) {
			const lower = h.toLowerCase()
			let score = 0
			for (const t of terms) {
				if (lower.includes(t)) score += 1
			}
			if (!best || score > best.score) best = { heading: h, score }
		}
		return best && best.score > 0 ? best.heading : undefined
	}

	const handleNavigateAndClose = (item: SearchItem) => {
		let target = item.slug
		if (item.type === "page") {
			const best = findBestMatchingHeading(item.headings, query)
			if (best) {
				const hash = slugifyHeading(best)
				target = `${item.slug}#${hash}`
			}
		}
		if (target) navigate(target)
		handleClose()
	}

	const handleResultSelect = (result: SearchResult) => {
		if (!isOpen) return
		const item = result.item
		let selectedItem: SearchItem & { highlightedText?: string } = item
		if (item.type === "page") {
			const best = findBestMatchingHeading(item.headings, query)
			if (best) {
				const hash = slugifyHeading(best)
				selectedItem = {
					...item,
					id: `${item.id}#${hash}`,
					title: best,
					slug: `${item.slug}#${hash}`,
					type: "heading",
					breadcrumb: [...(item.breadcrumb || []), item.title],
					highlightedText: result.highlightedText,
				}
			} else {
				selectedItem = { ...item, highlightedText: result.highlightedText }
			}
		} else {
			selectedItem = { ...item, highlightedText: result.highlightedText }
		}
		addToHistory(selectedItem)
		handleNavigateAndClose(selectedItem)
	}

	const handleHistorySelect = (item: SearchItem) => {
		handleNavigateAndClose(item)
	}

	const { selectedIndex } = useKeyboardNavigation({
		isOpen,
		results,
		onSelect: handleResultSelect,
		onClose: handleClose,
		onToggle: () => (isOpen ? handleClose() : openModal()),
	})

	if (!isOpen) {
		return <TriggerButton onOpen={openModal} placeholder={placeholder ?? t("placeholders.search_documentation")} />
	}

	// TODO refactor ? : ? :
	const content = query ? (
		results.length === 0 ? (
			<EmptyState query={query} />
		) : (
			results.map((result, index) => (
				<SearchResultRow
					key={`${result.item.slug || result.item.id}-${index}`}
					item={result.item}
					highlightedText={result.highlightedText}
					isSelected={index === selectedIndex}
					onClick={() => handleResultSelect(result)}
				/>
			))
		)
	) : history.length > 0 ? (
		<SearchHistory
			history={history}
			onSelect={handleHistorySelect}
			onRemove={removeFromHistory}
			onClear={clearHistory}
		/>
	) : (
		<EmptyState />
	)

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			getInitialFocus={() => inputRef.current}
			ariaLabel={t("placeholders.search_documentation")}
		>
			<SearchInput
				ref={inputRef}
				value={query}
				onChange={setQuery}
				placeholder={placeholder ?? t("placeholders.search_documentation")}
			/>

			<div className="max-h-96 overflow-y-auto overscroll-contain" aria-label={t("placeholders.search_documentation")}>
				{content}
			</div>

			<ResultsFooter resultsCount={results.length} query={query} />
		</Modal>
	)
}
