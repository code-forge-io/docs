import slug from "slug"

export type HeadingItem = {
	slug: string
	title: string
	level: number
	children: HeadingItem[]
}

export function extractHeadingTreeFromMarkdown(content: string): HeadingItem[] {
	const lines = content.split("\n")
	const headings: HeadingItem[] = []
	const headingRegex = /^(#{1,6})\s+(.+)$/

	for (const line of lines) {
		const match = headingRegex.exec(line)
		if (!match) continue

		const level = match[1].length
		if (level > 3) continue // ⬅️ skip h4, h5, h6

		const title = match[2].trim()
		const sectionSlug = slug(title)

		headings.push({ title, slug: sectionSlug, level, children: [] })
	}

	const root: HeadingItem[] = []
	const stack: HeadingItem[] = []

	for (const heading of headings) {
		while (stack.length > 0 && heading.level <= stack[stack.length - 1].level) {
			stack.pop()
		}

		if (stack.length === 0) {
			root.push(heading)
		} else {
			stack[stack.length - 1].children.push(heading)
		}

		stack.push(heading)
	}

	return root
}
