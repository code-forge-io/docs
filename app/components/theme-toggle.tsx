import { useEffect, useState } from "react"
import { IconButton } from "~/ui/icon-button"
import { getEffectiveTheme, toggleTheme } from "~/utils/theme"

export function ThemeToggle() {
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
		<IconButton
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
			onClick={handleClick}
			icons={[
				{ name: "Sun", show: theme === "light" },
				{ name: "Moon", show: theme === "dark" },
			]}
		/>
	)
}
