import { Search, Zap } from "lucide-react"
import { cn } from "~/utils/css"

export const EmptyState = ({ query }: { query?: string }) => {
	if (query) {
		return (
			<div className="px-4 py-8 text-center">
				<div
					className={cn(
						"mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full",
						"bg-[var(--color-empty-icon-bg)]"
					)}
				>
					<Search className="h-5 w-5 text-[var(--color-empty-icon)]" />
				</div>
				<p className="font-medium text-[var(--color-empty-text)]">No results found for "{query}"</p>
				<p className="mt-1 text-[var(--color-empty-text-muted)] text-sm">
					Try adjusting your search terms or check for typos
				</p>
			</div>
		)
	}

	return (
		<div className="px-4 py-8 text-center">
			<div
				className={cn(
					"mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full",
					"bg-gradient-to-br from-[var(--color-empty-gradient-from)] to-[var(--color-empty-gradient-to)]"
				)}
			>
				<Zap className="h-5 w-5 text-[var(--color-empty-icon-accent)]" />
			</div>
			<p className="mb-4 font-medium text-[var(--color-empty-text)]">Start typing to search...</p>
			<div className="flex items-center justify-center gap-6 text-[var(--color-empty-text-muted)] text-xs">
				<div className="flex items-center gap-1">
					<kbd
						className={cn(
							"rounded border border-[var(--color-kbd-border)] bg-[var(--color-kbd-bg)] px-1.5 py-0.5 font-mono"
						)}
					>
						↑
					</kbd>
					<kbd
						className={cn(
							"rounded border border-[var(--color-kbd-border)] bg-[var(--color-kbd-bg)] px-1.5 py-0.5 font-mono"
						)}
					>
						↓
					</kbd>
					<span>Navigate</span>
				</div>
				<div className="flex items-center gap-1">
					<kbd
						className={cn(
							"rounded border border-[var(--color-kbd-border)] bg-[var(--color-kbd-bg)] px-1.5 py-0.5 font-mono"
						)}
					>
						↵
					</kbd>
					<span>Select</span>
				</div>
				<div className="flex items-center gap-1">
					<kbd
						className={cn(
							"rounded border border-[var(--color-kbd-border)] bg-[var(--color-kbd-bg)] px-1.5 py-0.5 font-mono"
						)}
					>
						Tab
					</kbd>
					<span>Cycle</span>
				</div>
			</div>
		</div>
	)
}
