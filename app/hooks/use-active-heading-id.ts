import { useEffect, useState } from "react"
import { useLocation } from "react-router"

export function useActiveHeadingId(selector = "h2[id], h3[id], h4[id]") {
	const [activeId, setActiveId] = useState<string | null>(null)
	const location = useLocation()

	// biome-ignore lint/correctness/useExhaustiveDependencies:location.pathname is needed to retrigger on route changes
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id)
						break
					}
				}
			},
			{
				rootMargin: "0% 0% -70% 0%",
				threshold: 0.1,
			}
		)

		const elements = document.querySelectorAll(selector)
		for (const element of elements) {
			observer.observe(element)
		}

		return () => {
			observer.disconnect()
		}
	}, [selector, location.pathname])

	return activeId
}
