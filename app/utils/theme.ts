type Theme = "light" | "dark"
const THEME_KEY = "theme"

function getStoredTheme(): Theme | null {
	const stored = localStorage.getItem(THEME_KEY)
	if (stored === "light" || stored === "dark") return stored
	return null
}

function getSystemTheme(): Theme {
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function getEffectiveTheme(): Theme {
	return getStoredTheme() ?? getSystemTheme()
}

function applyTheme(theme: Theme) {
	const root = document.documentElement
	root.setAttribute("data-theme", theme)
	localStorage.setItem(THEME_KEY, theme)
}

export function toggleTheme() {
	const current = getEffectiveTheme()
	const next = current === "light" ? "dark" : "light"
	applyTheme(next)
}
