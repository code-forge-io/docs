import type { ComponentPropsWithoutRef } from "react"

export const CodeBlock = (props: ComponentPropsWithoutRef<"pre">) => {
	return (
		<pre
			{...props}
			className="overflow-x-auto rounded-lg p-4 font-mono text-sm"
			style={{
				backgroundColor: "var(--color-code-block-bg)",
				color: "var(--color-code-block-text)",
			}}
		/>
	)
}
