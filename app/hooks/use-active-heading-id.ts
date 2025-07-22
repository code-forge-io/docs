import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
// TODO this doesnt work the best

export function useActiveHeadingId(selector = "h2[id], h3[id], h4[id]") {
	const [activeId, setActiveId] = useState<string | null>(null)
	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const newId = entry.target.id
						setActiveId((prevId) => {
							if (prevId !== newId) {
								// Only update URL if heading actually changed
								const newHash = `#${newId}`
								if (location.hash !== newHash) {
									// Use replace to avoid polluting browser history
									navigate(`${location.pathname}${newHash}`, { replace: true })
								}
							}
							return newId
						})
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
	}, [selector, location.pathname, location.hash, navigate])

	return activeId
}
