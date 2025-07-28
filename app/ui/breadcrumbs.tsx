import { Children, type ReactNode, isValidElement } from "react"
import { cn } from "../utils/css"
import { Icon } from "./icon/icon"

interface BreadcrumbsProps {
	children: ReactNode
	className?: string
}

interface BreadcrumbItemProps {
	children: ReactNode
	href?: string
	isActive?: boolean
	className?: string
}

export const BreadcrumbItem = ({ children, href, isActive = false, className }: BreadcrumbItemProps) => {
	const classes = cn(
		"inline-flex items-center font-medium text-sm transition-all duration-200 ease-in-out",
		"text-[var(--color-text-normal)]",
		isActive && "pointer-events-none font-semibold text-[var(--color-text-active)]",
		className
	)

	if (href && !isActive) {
		return (
			<a href={href} className={classes}>
				{children}
			</a>
		)
	}

	return <span className={classes}>{children}</span>
}

export const Breadcrumbs = ({ children, className }: BreadcrumbsProps) => {
	const breadcrumbItems = Children.toArray(children).filter(
		(child) => isValidElement(child) && child.type === BreadcrumbItem
	) as React.ReactElement<BreadcrumbItemProps>[]

	return (
		<nav aria-label="Breadcrumbs" className={cn("", className)}>
			<ol className="flex items-center space-x-2">
				{breadcrumbItems.map((child, index) => (
					<li key={child.props.href || index} className="flex items-center">
						{index > 0 && (
							<Icon name="ChevronRight" className="mx-2 h-4 w-4 flex-shrink-0 text-[var(--color-text-muted)]" />
						)}
						{child}
					</li>
				))}
			</ol>
		</nav>
	)
}
