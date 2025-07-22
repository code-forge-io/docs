import clsx from "clsx"
import { useEffect, useState } from "react"
import { Icon } from "~/ui/icon/icon"
import { getEffectiveTheme, toggleTheme } from "~/utils/theme"

export function ThemeToggleButton() {
	const [theme, setTheme] = useState<"light" | "dark" | null>(null)

	useEffect(() => {
		const current = getEffectiveTheme()
		document.documentElement.classList.add(current)
		setTheme(current)
	}, [])

	const handleClick = () => {
		toggleTheme()
		const newTheme = getEffectiveTheme()
		setTheme(newTheme)
	}

	if (theme === null) return null

	return (
		<button
			type="button"
			onClick={handleClick}
			className="group relative inline-flex items-center justify-center rounded-full p-2 text-[var(--color-text-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border)] focus-visible:ring-offset-2"
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
		>
			<Icon
				name="Sun"
				className={clsx("absolute h-5 w-5 transition-all duration-300", {
					"rotate-90 scale-0 opacity-0": theme !== "light",
					"rotate-0 scale-100 opacity-100": theme === "light",
				})}
			/>
			<Icon
				name="Moon"
				className={clsx("absolute h-5 w-5 transition-all duration-300", {
					"-rotate-90 scale-0 opacity-0": theme !== "dark",
					"rotate-0 scale-100 opacity-100": theme === "dark",
				})}
			/>
		</button>
	)
}
