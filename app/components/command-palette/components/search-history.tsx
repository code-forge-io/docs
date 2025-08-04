import { Clock, Trash2, X } from "lucide-react"
import { cn } from "~/utils/css"
import type { SearchItem } from "../search-types"
import { SearchResult } from "./search-result"

interface SearchHistoryProps {
	history: SearchItem[]
	onSelect: (item: SearchItem) => void
	onRemove: (itemId: string) => void
	onClear: () => void
}

// Empty state component for no history
const EmptyHistoryState = () => (
	<div className="px-4 py-8 text-center">
		<div
			className={cn(
				"mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full",
				"bg-[var(--color-empty-icon-bg)]"
			)}
		>
			<Clock className="h-5 w-5 text-[var(--color-empty-icon)]" />
		</div>
		<p className="font-medium text-[var(--color-empty-text)]">No search history yet</p>
		<p className="mt-1 text-[var(--color-empty-text-muted)] text-sm">Your recent searches will appear here</p>
	</div>
)

// Header component with clear button
const SearchHistoryHeader = ({ onClear }: { onClear: () => void }) => (
	<div
		className={cn(
			"flex items-center justify-between border-[var(--color-history-header-border)] border-b",
			"bg-[var(--color-history-header-bg)] px-4 py-3"
		)}
	>
		<div className="flex items-center gap-2">
			<Clock className="h-4 w-4 text-[var(--color-result-meta)]" />
			<span className="font-medium text-[var(--color-history-header-text)] text-sm">Recent searches</span>
		</div>
		<ClearHistoryButton onClear={onClear} />
	</div>
)

// Clear history button component
const ClearHistoryButton = ({ onClear }: { onClear: () => void }) => (
	<button
		type="button"
		onClick={onClear}
		className={cn(
			"flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors",
			"text-[var(--color-result-meta)] hover:bg-[var(--color-history-clear-hover-bg)] hover:text-[var(--color-history-clear-hover-text)]"
		)}
		title="Clear history"
		aria-label="Clear search history"
	>
		<Trash2 className="h-3 w-3" />
		<span className="hidden sm:inline">Clear</span>
	</button>
)

// Remove item button component
const RemoveItemButton = ({
	onRemove,
	itemId,
}: {
	onRemove: (itemId: string) => void
	itemId: string
}) => (
	<button
		type="button"
		onClick={(e) => {
			e.stopPropagation()
			onRemove(itemId)
		}}
		className={cn(
			"-translate-y-1/2 absolute top-1/2 right-2 flex h-6 w-6 items-center justify-center rounded-full border opacity-0 transition-all duration-150 group-hover:opacity-100",
			"border-[var(--color-history-remove-border)] bg-[var(--color-history-remove-bg)] text-[var(--color-history-remove-text)]",
			"hover:border-[var(--color-history-remove-hover-border)] hover:text-[var(--color-history-remove-hover-text)]"
		)}
		title="Remove from history"
		aria-label={"Remove from history"}
	>
		<X className="h-3 w-3" />
	</button>
)

// Individual history item component
const HistoryItem = ({
	item,
	index,
	onSelect,
	onRemove,
}: {
	item: SearchItem
	index: number
	onSelect: (item: SearchItem) => void
	onRemove: (itemId: string) => void
}) => (
	<div key={`${item.id}-${index}`} className="group relative">
		<SearchResult item={item} highlightedText={item.title} isSelected={false} onClick={() => onSelect(item)} />
		<RemoveItemButton onRemove={onRemove} itemId={item.id} />
	</div>
)

// History items list component
const HistoryItemsList = ({
	history,
	onSelect,
	onRemove,
}: {
	history: SearchItem[]
	onSelect: (item: SearchItem) => void
	onRemove: (itemId: string) => void
}) => (
	<div className="max-h-64 overflow-y-auto">
		{history.map((item, index) => (
			<HistoryItem key={`${item.id}-${index}`} item={item} index={index} onSelect={onSelect} onRemove={onRemove} />
		))}
	</div>
)

// Main SearchHistory component
const SearchHistory = ({ history, onSelect, onRemove, onClear }: SearchHistoryProps) => {
	// Early return for empty state
	if (history.length === 0) {
		return <EmptyHistoryState />
	}

	return (
		<div>
			<SearchHistoryHeader onClear={onClear} />
			<HistoryItemsList history={history} onSelect={onSelect} onRemove={onRemove} />
		</div>
	)
}

export default SearchHistory
