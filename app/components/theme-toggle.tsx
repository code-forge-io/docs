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
		return <IconButton aria-label="Loading theme..." name="SunMoon" />
	}

	return (
		<div className="relative">
			{theme === "light" && <IconButton aria-label="Switch to dark mode" name="Moon" onClick={toggle} />}
			{theme === "dark" && <IconButton aria-label="Switch to light mode" name="Sun" onClick={toggle} />}
		</div>
	)
}
