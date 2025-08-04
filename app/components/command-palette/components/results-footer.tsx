import { cn } from "~/utils/css"

export const ResultsFooter = ({
	resultsCount,
	query,
}: {
	resultsCount: number
	query: string
}) => {
	if (!query || resultsCount === 0) return null

	return (
		<div className={cn("border-[var(--color-footer-border)] border-t bg-[var(--color-footer-bg)] px-4 py-3")}>
			<div className="flex items-center justify-between text-xs">
				<span className="font-medium text-[var(--color-footer-text)]">
					{resultsCount} result{resultsCount !== 1 ? "s" : ""}
				</span>
				<div className="flex items-center gap-4 text-[var(--color-footer-text)]">
					<div className="flex items-center gap-1">
						<kbd
							className={cn(
								"rounded border border-[var(--color-footer-kbd-border)] bg-[var(--color-footer-kbd-bg)] px-1.5 py-0.5 font-mono"
							)}
						>
							↑
						</kbd>
						<kbd
							className={cn(
								"rounded border border-[var(--color-footer-kbd-border)] bg-[var(--color-footer-kbd-bg)] px-1.5 py-0.5 font-mono"
							)}
						>
							↓
						</kbd>
						<span>Navigate</span>
					</div>
					<div className="flex items-center gap-1">
						<kbd
							className={cn(
								"rounded border border-[var(--color-footer-kbd-border)] bg-[var(--color-footer-kbd-bg)] px-1.5 py-0.5 font-mono"
							)}
						>
							↵
						</kbd>
						<span>Open</span>
					</div>
				</div>
			</div>
		</div>
	)
}
