import slugify from "slug"

export type HeadingItem = {
	slug: string
	title: string
	level: number
	children: HeadingItem[]
}

const headingRegex = /^\s*(#{1,6})\s+(.+?)\s*$/

const cleanMarkdown = (text: string) =>
	text
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/\*([^*]+)\*/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/\{[^}]*\}/g, "")
		.replace(/<\/?[^>]+(>|$)/g, "")
		.trim()

export function extractHeadingTreeFromMarkdown(content: string) {
	const root: HeadingItem[] = []
	const stack: HeadingItem[] = []

	for (const line of content.split("\n")) {
		const match = headingRegex.exec(line)
		if (!match) continue

		const level = match[1].length
		if (level > 3) continue

		const title = cleanMarkdown(match[2])
		const node: HeadingItem = {
			title,
			slug: slugify(title),
			level,
			children: [],
		}

		while (stack.length && stack[stack.length - 1].level >= level) {
			stack.pop()
		}

		if (stack.length === 0) {
			root.push(node)
		} else {
			stack[stack.length - 1].children.push(node)
		}

		stack.push(node)
	}

	return root
}
