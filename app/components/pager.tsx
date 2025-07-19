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

export function Pager({ previous, next }: PagerProps) {
	return (
		<nav
			className="mt-12 flex items-start justify-between border-t pt-6 text-[color:var(--color-text-muted)] text-sm"
			aria-label="Pagination navigation"
		>
			{/* TODO refactor this to not duplicate content */}
			{previous ? (
				<div>
					<div className="font-semibold text-[color:var(--color-text-link)]">Previous</div>
					<Link
						to={previous.to}
						prefetch="intent"
						className="-ml-2 hover:-translate-x-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[color:var(--color-text-link)] text-lg no-underline transition-all duration-200 ease-in-out hover:transform hover:text-[color:var(--color-text-hover)]"
					>
						<span
							aria-hidden="true"
							className="group-hover:-translate-x-0.5 transition-transform duration-200 ease-in-out"
						>
							←
						</span>{" "}
						{previous.title}
					</Link>
				</div>
			) : (
				<div />
			)}

			{next ? (
				<div className="text-right">
					<div className="font-semibold text-[color:var(--color-text-link)]">Next</div>
					<Link
						to={next.to}
						prefetch="intent"
						viewTransition
						className="-mr-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[color:var(--color-text-link)] text-lg no-underline transition-all duration-200 ease-in-out hover:translate-x-1 hover:transform hover:text-[color:var(--color-text-hover)]"
					>
						{next.title}{" "}
						<span
							aria-hidden="true"
							className="transition-transform duration-200 ease-in-out group-hover:translate-x-0.5"
						>
							→
						</span>
					</Link>
				</div>
			) : (
				<div />
			)}
		</nav>
	)
}
