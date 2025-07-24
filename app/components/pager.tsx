import { useTranslation } from "react-i18next"
import { Link } from "react-router"

interface PagerProps {
	previous?: {
		title: string
		to: string
	}
	next?: {
		title: string
		to: string
	}
}

interface PagerLinkProps {
	item: { title: string; to: string }
	direction: "previous" | "next"
	label: string
}

/**
 * Individual pager link component with consistent styling and behavior
 */
function PagerLink({ item, direction, label }: PagerLinkProps) {
	const isPrevious = direction === "previous"
	const arrow = isPrevious ? "←" : "→"

	const linkClasses = [
		"inline-flex items-center gap-1 rounded-md px-2 py-1",
		"text-[var(--color-text-active)] text-lg no-underline",
		"transition-transform duration-200 ease-in-out hover:transform hover:text-[color:var(--color-text-hover)]",
		isPrevious ? "-ml-2 hover:-translate-x-1" : "-mr-2 hover:translate-x-1",
	].join(" ")

	const arrowClasses = [
		"transition-transform duration-200 ease-in-out",
		isPrevious ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5",
	].join(" ")

	return (
		<div className={isPrevious ? "" : "text-right"}>
			<div className="font-semibold text-[var(--color-text-active)]">{label}</div>
			<Link
				to={item.to}
				prefetch="intent"
				{...(direction === "next" && { viewTransition: true })}
				className={linkClasses}
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
 * <Pager
 *   previous={{ title: "Getting Started", to: "/getting-started" }}
 *   next={{ title: "Advanced Topics", to: "/advanced-topics" }}
 * />
 *
 * @param previous - Optional previous page link data with title and path.
 * @param next - Optional next page link data with title and path.
 */
export function Pager({ previous, next }: PagerProps) {
	const { t } = useTranslation()

	return (
		<nav
			className="mt-12 flex items-start justify-between border-t pt-6 text-[var(--color-text-active)] text-sm"
			style={{ borderColor: "var(--color-border)" }}
			aria-label="Pagination navigation"
		>
			{previous ? <PagerLink item={previous} direction="previous" label={t("links.previous")} /> : <div />}

			{next ? <PagerLink item={next} direction="next" label={t("links.next")} /> : <div />}
		</nav>
	)
}
