import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Modal } from "~/components/modal"
import type { Version } from "~/utils/version-resolvers"
import { fuzzySearch } from "../hooks/use-fuzzy-search"
import { useKeyboardNavigation } from "../hooks/use-keyboard-navigation"
import { useModalState } from "../hooks/use-modal-state"
import { useSearchHistory } from "../hooks/use-search-history"
import type { MatchType, SearchDoc, SearchResult } from "../search-types"
import { EmptyState } from "./empty-state"
import { ResultsFooter } from "./results-footer"
import { SearchHistory } from "./search-history"
import { SearchInput } from "./search-input"
import { SearchResultRow } from "./search-result"
import { TriggerButton } from "./trigger-button"

interface CommandPaletteProps {
	searchIndex: SearchDoc[]
	placeholder?: string
	version: Version
}

const withVersion = (version: string, id: string) => `/${version}${id}`

export const CommandK = ({ searchIndex, placeholder, version }: CommandPaletteProps) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const inputRef = useRef<HTMLInputElement>(null)

	const [query, setQuery] = useState("")

	const { isOpen, openModal, closeModal } = useModalState()
	const { history, addToHistory, clearHistory, removeFromHistory } = useSearchHistory()

	const results = fuzzySearch(searchIndex, query, {
		threshold: 0.8,
		minMatchCharLength: 3,
	})

	const hasQuery = !!query.trim()
	const hasResults = !!results.length
	const hasHistory = !!history.length
	const searchPlaceholder = placeholder ?? t("placeholders.search_documentation")

	const handleClose = () => {
		closeModal()
		setQuery("")
	}

	const handleResultSelect = (result: SearchResult) => {
		if (!isOpen) return

		const rowItem = result.item
		const matchType: MatchType = result.refIndex === 0 ? "heading" : "paragraph"

		const historyItem = {
			...rowItem,
			type: matchType,
			slug: rowItem.id,
			highlightedText: result.highlightedText,
			version,
		}

		addToHistory(historyItem)
		navigate(withVersion(version, rowItem.id))
		handleClose()
	}

	const handleHistorySelect = (item: { slug?: string; id?: string; version?: string }) => {
		const id = item.slug || item.id
		if (!id) return

		const v = item.version ?? version
		navigate(withVersion(v, id))
		handleClose()
	}

	const handleToggle = () => {
		isOpen ? handleClose() : openModal()
	}

	const { selectedIndex } = useKeyboardNavigation({
		isOpen,
		results,
		onSelect: handleResultSelect,
		onClose: handleClose,
		onToggle: handleToggle,
	})

	if (!isOpen) {
		return <TriggerButton onOpen={openModal} placeholder={searchPlaceholder} />
	}

	const renderBody = () => {
		if (hasQuery) {
			if (!hasResults) return <EmptyState query={query} />

			return results.map((result, index) => (
				<SearchResultRow
					key={`${result.item.id}-${result.refIndex}`}
					item={result.item}
					highlightedText={result.highlightedText}
					isSelected={index === selectedIndex}
					onClick={() => handleResultSelect(result)}
					matchType={result.refIndex === 0 ? "heading" : "paragraph"}
				/>
			))
		}

		if (hasHistory) {
			return (
				<SearchHistory
					history={history}
					onSelect={handleHistorySelect}
					onRemove={removeFromHistory}
					onClear={clearHistory}
				/>
			)
		}

		return <EmptyState />
	}

	return (
		<Modal isOpen={isOpen} onClose={handleClose} getInitialFocus={() => inputRef.current} ariaLabel={searchPlaceholder}>
			<SearchInput ref={inputRef} value={query} onChange={setQuery} placeholder={searchPlaceholder} />

			<div className="max-h-96 overflow-y-auto overscroll-contain" aria-label={searchPlaceholder}>
				{renderBody()}
			</div>

			<ResultsFooter resultsCount={results.length} query={query} />
		</Modal>
	)
}
