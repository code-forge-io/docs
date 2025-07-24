import type { ComponentPropsWithoutRef, ReactElement } from "react"
import { cleanDiffLine, getDiffStyles, getDiffType } from "~/utils/code-block-diff"
import { type TokenType, getTokenColor, tokenize } from "~/utils/code-block-syntax-highlighter"
import { CopyButton } from "./copy-button"

interface CodeBlockProps extends Omit<ComponentPropsWithoutRef<"pre">, "children"> {
	children: string
}

interface ReactElementWithProps {
	props?: {
		children?: string
	}
}

const extractCodeContent = (children: string | ReactElementWithProps) => {
	const isString = typeof children === "string"
	const hasProps = !isString && children?.props?.children
	return isString ? children : hasProps || ""
}

const createTokenElement = (token: ReturnType<typeof tokenize>[0], index: number) => (
	<span key={index} style={{ color: getTokenColor(token.type as TokenType) }}>
		{token.value}
	</span>
)

const createDiffIndicator = (indicator: string) => (
	<span
		className="absolute top-0 left-2 w-4 select-none text-center font-medium"
		style={{ color: "var(--color-diff-indicator)" }}
	>
		{indicator}
	</span>
)

const createLineElement = (line: string, index: number) => {
	const diffType = getDiffType(line)
	const cleanLine = cleanDiffLine(line)
	const tokens = tokenize(cleanLine)
	const styles = getDiffStyles(diffType)
	const isNormalDiff = diffType === "normal"

	return (
		<div key={index} className="relative">
			<div
				className="flex min-h-[1.5rem] items-center pr-4 pl-8"
				style={{
					backgroundColor: styles.backgroundColor,
					borderLeft: styles.borderLeft,
					borderLeftColor: styles.borderLeftColor,
				}}
			>
				{!isNormalDiff && createDiffIndicator(styles.indicator)}
				<span className="block">{tokens.map(createTokenElement)}</span>
			</div>
		</div>
	)
}

const createCodeElement = (lines: string[]) => <code className="relative block">{lines.map(createLineElement)}</code>

const createPreElement = (
	props: Omit<ComponentPropsWithoutRef<"pre">, "children">,
	className: string,
	lines: string[]
): ReactElement => (
	<pre
		{...props}
		className={`relative overflow-x-auto rounded-lg py-4 font-mono text-sm leading-relaxed ${className}`}
		style={{
			backgroundColor: "var(--color-code-block-bg)",
			color: "var(--color-code-block-text)",
		}}
	>
		{createCodeElement(lines)}
	</pre>
)

export const CodeBlock = ({ children, className = "", ...props }: CodeBlockProps) => {
	const codeContent = extractCodeContent(children)
	const lines = codeContent.split("\n").filter((line, index, array) => {
		if (line.trim() === "" && index === array.length - 1) {
			return false
		}
		return true
	})

	return (
		<div className="group relative">
			{createPreElement(props, className, lines)}
			<CopyButton codeContent={codeContent} />
		</div>
	)
}
