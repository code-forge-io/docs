import type { ComponentPropsWithoutRef } from "react"
import { createLineData } from "../utils/code-block-parser"
import { getTokenColor, isTokenType, type tokenize } from "../utils/code-block-syntax-highlighter"

interface TokenElementProps {
	token: ReturnType<typeof tokenize>[0]
	index: number
}

const TokenElement = ({ token, index }: TokenElementProps) => {
	const { type, value } = token
	const color = isTokenType(type) ? getTokenColor(type) : ""

	return (
		<span key={index} style={{ color }}>
			{value}
		</span>
	)
}

interface DiffIndicatorProps {
	indicator: string
}

const DiffIndicator = ({ indicator }: DiffIndicatorProps) => (
	<span className="absolute top-0 left-0 w-4 select-none text-center font-medium text-[var(--color-diff-indicator)]">
		{indicator}
	</span>
)

interface LineElementProps {
	line: string
	index: number
}

const LineElement = ({ line, index }: LineElementProps) => {
	const { tokens, styles, isNormalDiff } = createLineData(line)

	return (
		<div key={index} className="relative">
			<div
				className="flex min-h-[1.5rem] items-center pr-4 pl-4"
				style={{
					backgroundColor: styles.backgroundColor,
					borderLeft: styles.borderLeft,
					borderLeftColor: styles.borderLeftColor,
				}}
			>
				{!isNormalDiff && <DiffIndicator indicator={styles.indicator} />}
				<span className="block">
					{tokens.map((token, tokenIndex) => (
						<TokenElement key={`${token.value}-${tokenIndex}`} token={token} index={tokenIndex} />
					))}
				</span>
			</div>
		</div>
	)
}

interface CodeElementProps {
	lines: string[]
}

const CodeElement = ({ lines }: CodeElementProps) => (
	<code className="relative block">
		{lines.map((line, index) => (
			<LineElement key={`${index}-${line}`} line={line} index={index} />
		))}
	</code>
)

interface PreElementProps extends Omit<ComponentPropsWithoutRef<"pre">, "children"> {
	lines: string[]
	className?: string
}

export const PreElement = ({ lines, className = "", ...props }: PreElementProps) => (
	<pre
		{...props}
		className={`relative overflow-x-auto rounded-lg border border-[var(--color-border)] py-4 font-mono text-sm leading-relaxed ${className}`}
		style={{
			backgroundColor: "var(--color-code-block-bg)",
			color: "var(--color-code-block-text)",
		}}
	>
		<CodeElement lines={lines} />
	</pre>
)
