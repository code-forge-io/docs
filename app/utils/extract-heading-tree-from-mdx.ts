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
		//remove inline code backticks
		.replace(/`([^`]+)`/g, "$1")
		//remove bold markers
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		//remove italic markers
		.replace(/\*([^*]+)\*/g, "$1")
		//remove markdown links, keep the link text
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		//remove curly-brace content
		.replace(/\{[^}]*\}/g, "")
		//remove HTML tags
		.replace(/<\/?[^>]+(>|$)/g, "")
		//tTrim trailing whitespace
		.trim()

//TODO this needs to handle more cases, for now it works but it shoud be more generic
//TODO after refactoring from the comment above, write tests
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
