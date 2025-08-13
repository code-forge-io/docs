import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { cn } from "~/utils/css"

interface PageNavigationItem {
	title: string
	to: string
}

interface PageNavigationProps {
	previous?: PageNavigationItem
	next?: PageNavigationItem
}

interface PageNavigationLinkProps {
	item: PageNavigationItem
	direction: "previous" | "next"
	label: string
}

function PageNavigationLink({ item, direction, label }: PageNavigationLinkProps) {
	const isPrevious = direction === "previous"
	const arrow = isPrevious ? "←" : "→"

	const arrowClasses = cn(
		"transition-transform duration-200 ease-in-out",
		isPrevious ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"
	)

	return (
		<div className={clsx({ "text-right": !isPrevious })}>
			<div className="font-semibold text-[var(--color-text-active)]">{label}</div>
			<Link
				to={item.to}
				prefetch="intent"
				{...(direction === "next" && { viewTransition: true })}
				className={cn(
					"inline-flex items-center gap-1 rounded-md px-2 py-1 text-[var(--color-text-active)] text-sm no-underline transition-transform duration-200 ease-in-out hover:transform hover:text-[color:var(--color-text-hover)] md:text-lg",
					isPrevious ? "-ml-2 hover:-translate-x-1" : "-mr-2 hover:translate-x-1"
				)}
			>
				{isPrevious && (
					<span aria-hidden="true" className={arrowClasses}>
						{arrow}
					</span>
				)}
				{item.title}
				{!isPrevious && (
					<span aria-hidden="true" className={arrowClasses}>
						{arrow}
					</span>
				)}
			</Link>
		</div>
	)
}

/**
 * A pagination navigation component that displays "Previous" and "Next" links with
 * accessible labels, styled arrows, and localized link text.
 *
 * It accepts optional `previous` and `next` props, each containing a `title` and `to` URL.
 * When present, the component renders navigational links with arrow indicators.
 *
 * Example usage:
 * <PageNavigation
 *   previous={{ title: "Getting Started", to: "/getting-started" }}
 *   next={{ title: "Advanced Topics", to: "/advanced-topics" }}
 * />
 *
 * @param previous - Optional previous page link data with title and path.
 * @param next - Optional next page link data with title and path.
 */
export function PageNavigation({ previous, next }: PageNavigationProps) {
	const { t } = useTranslation()

	return (
		<nav
			className="mt-12 flex items-start justify-between border-[var(--color-border) border-t pt-6 text-[var(--color-text-active)] text-sm"
			aria-label="Pagination navigation"
		>
			{previous ? <PageNavigationLink item={previous} direction="previous" label={t("links.previous")} /> : <div />}

			{next ? <PageNavigationLink item={next} direction="next" label={t("links.next")} /> : <div />}
		</nav>
	)
}
