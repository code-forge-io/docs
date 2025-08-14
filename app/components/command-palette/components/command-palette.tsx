import { useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Modal } from "~/components/modal"
import { fuzzySearch } from "../hooks/use-fuzzy-search"
import { useKeyboardNavigation } from "../hooks/use-keyboard-navigation"
import { useModalState } from "../hooks/use-modal-state"
import { useSearchHistory } from "../hooks/use-search-history"
import type { SearchItem } from "../search-types"
import { EmptyState } from "./empty-state"
import { ResultsFooter } from "./results-footer"
import SearchHistory from "./search-history"
import { SearchInput } from "./search-input"
import { SearchResult } from "./search-result"
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

	const results = useMemo(() => {
		return fuzzySearch(searchIndex, query, {
			threshold: 0.8,
			minMatchCharLength: 3,
		})
	}, [query, searchIndex])

	const handleClose = () => {
		closeModal()
		setQuery("")
	}

	const handleNavigateAndClose = (item: SearchItem) => {
		if (item.slug) navigate(item.slug)
		handleClose()
	}

	const handleResultSelect = (item: SearchItem) => {
		addToHistory(item)
		handleNavigateAndClose(item)
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

	const content = query ? (
		results.length === 0 ? (
			<EmptyState query={query} />
		) : (
			results.map((result, index) => (
				<SearchResult
					key={`${result.item.slug || result.item.id}-${index}`}
					item={result.item}
					highlightedText={result.highlightedText}
					isSelected={index === selectedIndex}
					onClick={() => handleResultSelect(result.item)}
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
				onChange={setQuery} // Ensure SearchInput calls with the string
				placeholder={placeholder ?? t("placeholders.search_documentation")}
			/>

			<div className="max-h-96 overflow-y-auto overscroll-contain" aria-label={t("placeholders.search_documentation")}>
				{content}
			</div>

			<ResultsFooter resultsCount={results.length} query={query} />
		</Modal>
	)
}
