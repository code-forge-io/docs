import { useTranslation } from "react-i18next"
import { cn } from "~/utils/css"

export const ResultsFooter = ({
	resultsCount,
	query,
}: {
	resultsCount: number
	query: string
}) => {
	const { t } = useTranslation()
	if (!query || resultsCount === 0) return null

	return (
		<div className={cn("border-[var(--color-footer-border)] border-t bg-[var(--color-footer-bg)] px-4 py-3")}>
			<div className="flex items-center justify-between text-xs">
				<span className="font-medium text-[var(--color-footer-text)]">{t("text.result", { count: resultsCount })}</span>
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
						<span>{t("controls.navigate")}</span>
					</div>
					<div className="flex items-center gap-1">
						<kbd
							className={cn(
								"rounded border border-[var(--color-footer-kbd-border)] bg-[var(--color-footer-kbd-bg)] px-1.5 py-0.5 font-mono"
							)}
						>
							↵
						</kbd>
						<span>{t("controls.open")}</span>
					</div>
				</div>
			</div>
		</div>
	)
}
