import { cleanDiffLine, getDiffStyles, getDiffType } from "../utils/code-block-diff"
import { tokenize } from "../utils/code-block-syntax-highlighter"

interface ReactElementWithProps {
	props?: {
		children?: string
	}
}

export const extractCodeContent = (children: string | ReactElementWithProps) =>
	typeof children === "string" ? children : (children?.props?.children ?? "")

export const processLines = (content: string) => {
	const lines = content.split("\n")
	return filterEmptyLines(lines)
}

const filterEmptyLines = (lines: string[]) => {
	return lines.filter((line, index, array) => {
		const isLastLine = index === array.length - 1
		const isEmpty = line.trim() === ""
		return !(isEmpty && isLastLine)
	})
}

export const createLineData = (line: string) => {
	const diffType = getDiffType(line)
	const cleanLine = cleanDiffLine(line)
	const tokens = tokenize(cleanLine)
	const styles = getDiffStyles(diffType)
	const isNormalDiff = diffType === "normal"

	return {
		diffType,
		cleanLine,
		tokens,
		styles,
		isNormalDiff,
	}
}

export const processCopyContent = (content: string) => {
	return content
		.split("\n")
		.filter((line) => !line.trimStart().startsWith("- "))
		.map((line) => line.replace(/^(\s*)\+ /, "$1"))
		.join("\n")
}
