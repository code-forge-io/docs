import type { ComponentPropsWithoutRef } from "react"
import { LineElement } from "./line-element"

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
		className={`relative overflow-x-auto rounded-lg py-4 font-mono text-sm leading-relaxed ${className}`}
		style={{
			backgroundColor: "var(--color-code-block-bg)",
			color: "var(--color-code-block-text)",
		}}
	>
		<CodeElement lines={lines} />
	</pre>
)
