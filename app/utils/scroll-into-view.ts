export function scrollIntoView(e: React.MouseEvent, id: string, offset = -20, behavior: ScrollBehavior = "smooth") {
	e.preventDefault()

	const element = document.getElementById(id)
	if (!element) return

	const y = element.getBoundingClientRect().top + window.scrollY + offset

	window.scrollTo({ top: y, behavior })
}
