import { useLayoutEffect, useState } from "react"
import { IconButton } from "~/ui/icon-button"
import { applyTheme, getCurrentTheme } from "~/utils/theme"

export function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark" | null>(null)

	useLayoutEffect(() => {
		setTheme(getCurrentTheme())
	}, [])

	const toggle = () => {
		if (!theme) return
		const next = theme === "dark" ? "light" : "dark"
		applyTheme(next)
		setTheme(next)
	}

	if (theme === null) {
		return <IconButton aria-label="Loading theme..." icons={[{ name: "SunMoon", show: true }]} />
	}

	return (
		<IconButton
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
			onClick={toggle}
			icons={[
				{ name: "Sun", show: theme === "light" },
				{ name: "Moon", show: theme === "dark" },
			]}
		/>
	)
}
