import type { ComponentPropsWithoutRef } from "react"

/**
 * A styled wrapper around the native <pre> element, used to display preformatted code blocks with consistent styling.
 *
 * Example usage:
 * <CodeBlock>
 *   {`npm install forge42/base-stack`}
 * </CodeBlock>
 */
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
