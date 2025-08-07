import { useEffect, useState } from "react"

/**
 * Hook to determine if the current viewport is considered mobile (below 768px).
 * Returns true if mobile, false otherwise.
 */
export function useMobileView(breakpoint = 1280) {
	const [isMobile, setIsMobile] = useState<boolean | null>(null)

	useEffect(() => {
		const update = () => {
			setIsMobile(window.innerWidth < breakpoint)
		}
		update()
		window.addEventListener("resize", update)
		return () => window.removeEventListener("resize", update)
	}, [breakpoint])

	return { isMobile }
}
