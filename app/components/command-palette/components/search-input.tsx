import { Search } from "lucide-react"
import { forwardRef } from "react"
import { cn } from "~/utils/css"

export const SearchInput = forwardRef<
	HTMLInputElement,
	{
		value: string
		onChange: (value: string) => void
		placeholder: string
	}
>(({ value, onChange, placeholder }, ref) => (
	<div
		className={cn(
			"flex items-center gap-3 border-[var(--color-input-border)] border-b bg-[var(--color-input-bg)] px-4 py-4"
		)}
	>
		<Search className="h-5 w-5 flex-shrink-0 text-[var(--color-input-icon)]" />
		<input
			ref={ref}
			type="text"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			className={cn(
				"flex-1 bg-transparent text-lg leading-6 outline-none",
				"text-[var(--color-input-text)] placeholder-[var(--color-input-placeholder)]"
			)}
			autoComplete="off"
			autoCorrect="off"
			autoCapitalize="off"
			spellCheck="false"
		/>
		<div className="flex items-center gap-2">
			<kbd
				className={cn(
					"hidden rounded border border-[var(--color-kbd-border)] bg-[var(--color-kbd-bg)] px-2 py-1 font-mono text-xs sm:block",
					"text-[var(--color-kbd-text)]"
				)}
			>
				ESC
			</kbd>
		</div>
	</div>
))
