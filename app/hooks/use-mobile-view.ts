import { useEffect, useState } from "react"

/**
 * Hook to determine if the current viewport is considered mobile (below 768px).
 * Returns true if mobile, false otherwise.
 */
export function useMobileView(breakpoint = 1280) {
	const [isMobile, setIsMobile] = useState(() => {
		if (typeof window === "undefined") return false
		return window.innerWidth < breakpoint
	})

	useEffect(() => {
		function handleResize() {
			setIsMobile(window.innerWidth < breakpoint)
		}
		window.addEventListener("resize", handleResize)
		handleResize()
		return () => window.removeEventListener("resize", handleResize)
	}, [breakpoint])

	return { isMobile }
}
