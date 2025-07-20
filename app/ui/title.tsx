import { cn } from "../utils/css"

export const ValidTitleElements = {
	h1: "text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight font-bold",
	h2: "text-xl sm:text-2xl md:text-3xl leading-snug tracking-tight font-semibold",
	h3: "text-lg sm:text-xl md:text-2xl leading-snug tracking-normal font-semibold",
	h4: "text-base sm:text-lg md:text-xl leading-snug tracking-normal font-medium",
	h5: "text-sm sm:text-base md:text-lg leading-normal tracking-normal font-medium",
	h6: "text-xs sm:text-sm md:text-base leading-normal tracking-normal font-medium",
} as const

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode
	as: keyof typeof ValidTitleElements
	className?: string
}

/**
 * This component is used to display titles with consistent styling across the project.
 * It ensures that all titles have the same font size, line height, and other styling properties.
 *
 * The `Title` component supports different HTML elements (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `div`) to accommodate various design requirements.
 * It also allows for custom classes to be applied for additional styling.
 *
 * The `as` prop determines the HTML element to render, which can be a heading element (`h1` to `h6`) or a `div`.
 *
 * Returns a JSX element containing the title wrapped with project-specific styling.
 */
const Title = ({ children, as, className, ...props }: TitleProps) => {
	const Component = as
	const titleClasses = cn(ValidTitleElements[as], "text-[var(--color-text-normal)]", className)

	return (
		<Component {...props} className={titleClasses}>
			{children}
		</Component>
	)
}

export { Title }
