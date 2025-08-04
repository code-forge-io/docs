import { useEffect, useMemo, useRef } from "react"
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

const CommandPalette = ({
	searchIndex,
	onNavigate,
	placeholder = "Search documentation...",
	maxResults = 10,
	isOpen: controlledIsOpen,
	onOpenChange,
}: CommandPaletteProps) => {
	// Refs for DOM elements
	const inputRef = useRef<HTMLInputElement>(null)
	const resultsRef = useRef<HTMLDivElement>(null)
	const modalRef = useRef<HTMLDivElement>(null)

	// State management hooks
	const { isOpen, openModal, closeModal } = useModalState(controlledIsOpen, onOpenChange)
	const { history, addToHistory, clearHistory, removeFromHistory } = useSearchHistory()

	// Search functionality
	const { query, setQuery, handleSelect, clearQuery } = useSearch(undefined, maxResults, addToHistory)

	const results = useMemo(() => {
		return fuzzySearch(searchIndex, query, {
			keys: ["title", "description", "content", "headings", "tags", "category", "section"],
			threshold: 0.8,
			minMatchCharLength: 3,
		})
	}, [query, searchIndex])

	// Navigation handlers
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

	// Keyboard navigation
	const { selectedIndex } = useKeyboardNavigation({
		isOpen,
		results,
		onSelect: handleResultSelect,
		onClose: handleClose,
		onToggle: () => (isOpen ? handleClose() : openModal()),
	})

	// Focus management and body scroll lock
	useEffect(() => {
		if (isOpen) {
			const timeoutId = setTimeout(() => {
				inputRef.current?.focus()
			}, MODAL_FOCUS_DELAY_MS)

			document.body.style.overflow = "hidden"

			return () => {
				clearTimeout(timeoutId)
				document.body.style.overflow = "unset"
			}
		}
		document.body.style.overflow = "unset"
		clearQuery()
	}, [isOpen, clearQuery])
	// Auto-scroll selected item into view
	useEffect(() => {
		if (resultsRef.current && selectedIndex >= 0 && results.length > 0) {
			const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
			selectedElement?.scrollIntoView({
				block: "nearest",
				behavior: "smooth",
			})
		}
	}, [selectedIndex, results.length])

	// Render trigger button when closed
	if (!isOpen) {
		return <TriggerButton onOpen={openModal} placeholder={placeholder} />
	}

	// Render modal content based on state
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
					<SearchInput ref={inputRef} value={query} onChange={setQuery} placeholder={placeholder} />

					<div ref={resultsRef} className="max-h-96 overflow-y-auto overscroll-contain">
						{renderContent()}
					</div>

					<ResultsFooter resultsCount={results.length} query={query} />
				</div>
			</div>
		</div>
	)
}

export default CommandPalette
