import type { ComponentPropsWithoutRef } from "react"

/**
 * A styled wrapper around the native <code> element, used to display inline code snippets with consistent styling.
 *
 * Useful for rendering short code expressions, variable names, or commands within paragraphs or markdown content.
 *
 * Example usage:
 * <p>
 *   Install it using <InlineCode>npm install forge42/base-stack</InlineCode>.
 * </p>
 */
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
