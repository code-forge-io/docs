import { useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "~/utils/css"
import { fuzzySearch } from "../hooks/use-fuzzy-search"
import { useKeyboardNavigation } from "../hooks/use-keyboard-navigation"
import { useModalState } from "../hooks/use-modal-state"
import { useSearch } from "../hooks/use-search"
import { useSearchHistory } from "../hooks/use-search-history"
import type { SearchItem } from "../search-types"
import { EmptyState } from "./empty-state"
import { ModalBackdrop } from "./modal-backdrop"
import { ResultsFooter } from "./results-footer"
import SearchHistory from "./search-history"
import { SearchInput } from "./search-input"
import { SearchResult } from "./search-result"
import { TriggerButton } from "./trigger-button"

const MODAL_FOCUS_DELAY_MS = 100

interface CommandPaletteProps {
	searchIndex: SearchItem[]
	onNavigate: (item: SearchItem) => void
	placeholder?: string
	maxResults?: number
	isOpen?: boolean
	onOpenChange?: (open: boolean) => void
}

export const CommandPalette = ({
	searchIndex,
	onNavigate,
	placeholder,
	maxResults = 10,
	isOpen: controlledIsOpen,
	onOpenChange,
}: CommandPaletteProps) => {
	const { t } = useTranslation()
	const inputRef = useRef<HTMLInputElement>(null)
	const resultsRef = useRef<HTMLDivElement>(null)
	const modalRef = useRef<HTMLDivElement>(null)

	const { isOpen, openModal, closeModal } = useModalState(controlledIsOpen, onOpenChange)
	const { history, addToHistory, clearHistory, removeFromHistory } = useSearchHistory()
	const { query, setQuery, handleSelect, clearQuery } = useSearch(undefined, maxResults, addToHistory)

	const results = useMemo(() => {
		return fuzzySearch(searchIndex, query, {
			threshold: 0.8,
			minMatchCharLength: 3,
		})
	}, [query, searchIndex])

	const handleNavigateAndClose = (item: SearchItem) => {
		onNavigate(item)
		closeModal()
	}

	const handleResultSelect = (item: SearchItem) => {
		handleSelect(item)
		handleNavigateAndClose(item)
	}

	const handleHistorySelect = (item: SearchItem) => {
		handleNavigateAndClose(item)
	}

	const handleClose = () => {
		closeModal()
		clearQuery()
	}

	const { selectedIndex } = useKeyboardNavigation({
		isOpen,
		results,
		onSelect: handleResultSelect,
		onClose: handleClose,
		onToggle: () => (isOpen ? handleClose() : openModal()),
	})

	useEffect(() => {
		if (isOpen) {
			const timeoutId = setTimeout(() => {
				inputRef.current?.focus()
			}, MODAL_FOCUS_DELAY_MS)

			const prev = document.body.style.overflow
			document.body.style.overflow = "hidden"

			return () => {
				clearTimeout(timeoutId)
				document.body.style.overflow = prev || "unset"
			}
		}
		document.body.style.overflow = "unset"
		clearQuery()
	}, [isOpen, clearQuery])

	if (!isOpen) {
		return <TriggerButton onOpen={openModal} placeholder={placeholder ?? `${t("placeholders.search_documentation")}`} />
	}

	const renderContent = () => {
		if (query) {
			return results.length === 0 ? (
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
		}

		return history.length > 0 ? (
			<SearchHistory
				history={history}
				onSelect={handleHistorySelect}
				onRemove={removeFromHistory}
				onClear={clearHistory}
			/>
		) : (
			<EmptyState />
		)
	}

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<ModalBackdrop onClose={closeModal} />

			<div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24">
				<div
					ref={modalRef}
					className={cn(
						"w-full max-w-2xl transform overflow-hidden rounded-xl border-[var(--color-modal-border)] bg-[var(--color-modal-bg)] transition-all duration-200",
						"shadow-[0_25px_50px_-12px_var(--color-modal-shadow)]"
					)}
				>
					<SearchInput
						ref={inputRef}
						value={query}
						onChange={setQuery}
						placeholder={placeholder ?? `${t("placeholders.search_documentation")}`}
					/>

					<div
						ref={resultsRef}
						className="max-h-96 overflow-y-auto overscroll-contain"
						aria-label={`${t("placeholders.search_documentation")}`}
					>
						{renderContent()}
					</div>

					<ResultsFooter resultsCount={results.length} query={query} />
				</div>
			</div>
		</div>
	)
}
