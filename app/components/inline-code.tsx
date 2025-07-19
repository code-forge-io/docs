import type { ComponentPropsWithoutRef } from "react"

export const InlineCode = (props: ComponentPropsWithoutRef<"code">) => {
	return (
		<code
			{...props}
			className="rounded px-1.5 py-0.5 font-mono text-sm"
			style={{
				backgroundColor: "var(--color-code-inline-bg)",
				color: "var(--color-code-inline-text)",
			}}
		/>
	)
}
