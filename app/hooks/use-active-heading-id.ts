import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation } from "react-router"

export function useActiveHeadingId(selector = "h2[id], h3[id], h4[id]") {
	const [activeId, setActiveId] = useState<string | null>(null)
	const isManualRef = useRef(false)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

	const location = useLocation()

	const setManualActiveId = useCallback((id: string) => {
		setActiveId(id)
		isManualRef.current = true

		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => {
			isManualRef.current = false
		}, 1000)
	}, [])

	// biome-ignore lint/correctness/useExhaustiveDependencies: locaion.pathname shoud be in the dependency array
	useEffect(() => {
		const headings = document.querySelectorAll<HTMLElement>(selector)
		if (!headings.length) {
			setActiveId(null)
			return
		}

		const hash = location.hash.slice(1)
		const hasValidHash = hash && Array.from(headings).some((h) => h.id === hash)
		setActiveId(hasValidHash ? hash : null)

		const observer = new IntersectionObserver(
			(entries) => {
				if (isManualRef.current) return

				const topEntry = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top)[0]

				setActiveId(topEntry?.target.id ?? null)
			},
			{ rootMargin: "0% 0% -70% 0%", threshold: 0.1 }
		)

		for (const el of headings) observer.observe(el)

		const handleHashChange = () => {
			const id = location.hash.slice(1)
			if (id && Array.from(headings).some((h) => h.id === id)) {
				setManualActiveId(id)
			}
		}

		addEventListener("hashchange", handleHashChange)

		return () => {
			observer.disconnect()
			removeEventListener("hashchange", handleHashChange)
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
		}
	}, [selector, location.pathname, setManualActiveId, location.hash])

	return { activeId, setManualActiveId }
}
