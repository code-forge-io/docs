import { useTranslation } from "react-i18next"
import { cn } from "~/utils/css"
import { KeyboardHint } from "./keyboard-hint"

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
					<KeyboardHint keys={["↑", "↓"]} label={t("controls.navigate")} />
					<KeyboardHint keys="↵" label={t("controls.select")} />
					<span className="text-[var(--color-footer-text)] text-xs opacity-70">
						Search by{" "}
						<span className="font-semibold">
							<a href="https://www.forge42.dev/" target="_blank" rel="noopener noreferrer">
								Forge 42
							</a>
						</span>
					</span>
				</div>
			</div>
		</div>
	)
}
