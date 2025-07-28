import { useCallback, useEffect, useRef, useState } from "react"

export function useActiveHeadingId(selector = "h2[id], h3[id], h4[id]", resetKey?: string) {
	const [activeId, setActiveId] = useState<string | null>(null)
	const isManualRef = useRef(false)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

	const setManualActiveId = useCallback((id: string) => {
		setActiveId(id)
		isManualRef.current = true

		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		timeoutRef.current = setTimeout(() => {
			isManualRef.current = false
		}, 1000)
	}, [])

	// TODO refactor this
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const headings = document.querySelectorAll<HTMLElement>(selector)
		if (!headings.length) {
			setActiveId(null)
			return
		}

		// Set initial active heading from hash
		const hash = location.hash.slice(1)
		const hasValidHash = hash && Array.from(headings).some((h) => h.id === hash)
		setActiveId(hasValidHash ? hash : null)

		// Intersection observer for scroll-based active heading
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

		// TODO use for of
		// biome-ignore lint/complexity/noForEach: TODO use for of
		headings.forEach((el) => observer.observe(el))

		// Handle hash changes
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
	}, [selector, resetKey, setManualActiveId])

	return { activeId, setManualActiveId }
}
