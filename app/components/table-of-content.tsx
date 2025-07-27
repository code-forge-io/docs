import { useRouteLoaderData } from "react-router"
import { useActiveHeadingId } from "~/hooks/use-active-heading-id"
import { createGitHubContributionLinks } from "~/utils/create-github-contribution-links"
import { scrollIntoView } from "~/utils/scroll-into-view"
import type { HeadingItem } from "~/utils/table-of-content"

interface TableOfContentsProps {
	items: HeadingItem[]
	className?: string
	pagePath: string
}

const TocItem = ({
	item,
	depth = 0,
	activeId,
}: {
	item: HeadingItem
	depth?: number
	activeId: string | null
}) => {
	const paddingLeft = 12 + depth * 16
	const isActive = activeId === item.slug

	return (
		<div>
			<a
				href={`#${item.slug}`}
				style={{ paddingLeft }}
				className={`block border-l py-1.5 text-sm transition-all duration-200 hover:border-[var(--color-code-inline-text)] hover:text-[var(--color-text-hover)]${depth === 0 ? "font-medium" : ""}
					${isActive ? "border-[var(--color-text-accent)] text-[var(--color-text-accent)]" : "border-transparent text-[var(--color-text-normal)]"}
				`}
				onClick={(e) => scrollIntoView(e, item.slug)}
			>
				{item.title}
			</a>
			{item.children.length > 0 && (
				<div className="space-y-0.5">
					{item.children.map((child) => (
						<TocItem key={child.slug} item={child} depth={depth + 1} activeId={activeId} />
					))}
				</div>
			)}
		</div>
	)
}

export const TableOfContents = ({ items, className = "", pagePath }: TableOfContentsProps) => {
	const activeId = useActiveHeadingId()
	const { clientEnv } = useRouteLoaderData("root")
	const { GITHUB_OWNER, GITHUB_REPO } = clientEnv

	const { editUrl, issueUrl } = createGitHubContributionLinks({
		pagePath,
		owner: GITHUB_OWNER,
		repo: GITHUB_REPO,
	})
	if (items.length === 0) return null

	return (
		<nav aria-label="Table of contents" className={`fixed top-14 hidden xl:block ${className}`}>
			<div className="rounded-lg bg-[var(--color-background)] p-4">
				<div className="mb-3 flex gap-3 text-[var(--color-text-active)] text-xs">
					<a
						href={issueUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-[var(--color-text-accent)] hover:underline"
					>
						Report an issue with this page
					</a>
					<span>|</span>
					<a
						href={editUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-[var(--color-text-accent)] hover:underline"
					>
						Edit this page
					</a>
				</div>
				<h2 className="mb-2 pb-2 font-semibold text-[var(--color-text-active)] text-sm">On this page</h2>
				<div className="max-h-[calc(100vh-12rem)] space-y-1 overflow-y-auto border-[var(--color-border)] border-l">
					{items.map((item) => (
						<TocItem key={item.slug} item={item} activeId={activeId} />
					))}
				</div>
			</div>
		</nav>
	)
}
