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

		window.scrollTo({ top: y, behavior })

		if (behavior === "smooth") {
			const scrollDistance = Math.abs(window.scrollY - y)
			const estimatedDuration = Math.min(scrollDistance / 2, 1000)

			setTimeout(() => {
				resolve()
			}, estimatedDuration)
		} else {
			setTimeout(resolve, 0)
		}
	})
}
