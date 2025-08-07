import type { ComponentPropsWithoutRef } from "react"
import { extractCodeContent, processLines } from "../utils/code-block-parser"
import { PreElement } from "./code-block-elements"
import { CopyButton } from "./copy-button"

interface CodeBlockProps extends Omit<ComponentPropsWithoutRef<"pre">, "children"> {
	children: string
}

export const CodeBlock = ({ children, className = "", ...props }: CodeBlockProps) => {
	const { code } = extractCodeContent(children)
	const lines = processLines(code)

	return (
		<div className="group relative">
			<PreElement lines={lines} className={className} {...props} />
			<CopyButton lines={lines} />
		</div>
	)
}
