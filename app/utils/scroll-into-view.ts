export function scrollIntoView(
	e: React.MouseEvent,
	id: string,
	offset = -80,
	behavior: ScrollBehavior = "smooth"
): Promise<void> {
	e.preventDefault()

	return new Promise((resolve) => {
		const element = document.getElementById(id)
		if (!element) {
			resolve()
			return
		}

		const y = element.getBoundingClientRect().top + window.scrollY + offset

		// Scroll to the element
		window.scrollTo({ top: y, behavior })

		// If smooth scrolling, wait for it to complete
		if (behavior === "smooth") {
			// Estimate scroll duration and add buffer
			const scrollDistance = Math.abs(window.scrollY - y)
			const estimatedDuration = Math.min(scrollDistance / 2, 1000) // Max 1 second

			setTimeout(() => {
				resolve()
			}, estimatedDuration)
		} else {
			// Immediate scroll
			setTimeout(resolve, 0)
		}
	})
}
