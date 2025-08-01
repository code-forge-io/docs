import { useCallback } from "react"
import { useLocation, useNavigate, useRouteLoaderData } from "react-router"
import { useActiveHeadingId } from "~/hooks/use-active-heading-id"
import { createGitHubContributionLinks } from "~/utils/create-github-contribution-links"
import { scrollIntoView } from "~/utils/scroll-into-view"
import type { HeadingItem } from "~/utils/table-of-content"

interface TableOfContentsProps {
	items: HeadingItem[]
	className?: string
	pagePath: string
}

interface TocItemProps {
	item: HeadingItem
	depth?: number
	activeId: string | null
	onItemClick: (slug: string) => Promise<void>
}

interface GitHubLinks {
	editUrl: string
	issueUrl: string
}

const BASE_PADDING = 12
const DEPTH_MULTIPLIER = 16

const itemStyles = {
	base: "block py-1.5 text-sm transition-all duration-200 hover:text-[var(--color-text-hover)] border-transparent",
	depth0: "font-medium",
	active: "border-[var(--color-text-accent)] font-bold text-[var(--color-text-accent)]",
	inactive: "text-[var(--color-text-normal)]",
}

const linkStyles = "hover:text-[var(--color-text-accent)] hover:underline"

const calculatePadding = (depth: number): number => BASE_PADDING + depth * DEPTH_MULTIPLIER

const getItemClassName = (depth: number, isActive: boolean): string => {
	const baseClasses = [itemStyles.base]

	if (depth === 0) baseClasses.push(itemStyles.depth0)
	baseClasses.push(isActive ? itemStyles.active : itemStyles.inactive)

	return baseClasses.join(" ")
}

const TocItem = ({ item, depth = 0, activeId, onItemClick }: TocItemProps) => {
	const paddingLeft = calculatePadding(depth)
	const isActive = activeId === item.slug
	const className = getItemClassName(depth, isActive)

	const handleClick = useCallback(
		async (e: React.MouseEvent) => {
			e.preventDefault()
			await onItemClick(item.slug)
		},
		[item.slug, onItemClick]
	)

	return (
		<div>
			<a
				href={`#${item.slug}`}
				style={{ paddingLeft }}
				className={className}
				onClick={handleClick}
				aria-current={isActive && "location"}
			>
				{item.title}
			</a>
			{item.children.length > 0 && (
				<div className="space-y-0.5">
					{item.children.map((child) => (
						<TocItem key={child.slug} item={child} depth={depth + 1} activeId={activeId} onItemClick={onItemClick} />
					))}
				</div>
			)}
		</div>
	)
}

const GitHubLinks = ({ editUrl, issueUrl }: GitHubLinks) => (
	<div className="mb-10 flex flex-col gap-3 text-[var(--color-text-active)] text-sm">
		<a href={issueUrl} target="_blank" rel="noopener noreferrer" className={linkStyles}>
			Report an issue with this page
		</a>
		<a href={editUrl} target="_blank" rel="noopener noreferrer" className={linkStyles}>
			Edit this page
		</a>
	</div>
)

const TableOfContentsHeader = () => (
	<h2 className="mb-4 border-[var(--color-border)] border-b pb-2 font-semibold text-[var(--color-text-active)] text-base">
		On this page
	</h2>
)

const Navigation = ({
	items,
	activeId,
	onItemClick,
}: {
	items: HeadingItem[]
	activeId: string | null
	onItemClick: (slug: string) => Promise<void>
}) => (
	<nav aria-label="Table of contents" className="-mr-4 max-h-[calc(100vh-var(--header-height))] overflow-y-auto pr-4">
		<div className="space-y-1 pb-8">
			{items.map((item) => (
				<TocItem key={item.slug} item={item} activeId={activeId} onItemClick={onItemClick} />
			))}
		</div>
	</nav>
)

export const TableOfContents = ({ items, pagePath }: TableOfContentsProps) => {
	const location = useLocation()
	const navigate = useNavigate()
	const { activeId, setManualActiveId } = useActiveHeadingId(undefined, location.pathname)
	const { clientEnv } = useRouteLoaderData("root")

	const { GITHUB_OWNER, GITHUB_REPO } = clientEnv
	const githubLinks = createGitHubContributionLinks({
		pagePath,
		owner: GITHUB_OWNER,
		repo: GITHUB_REPO,
	})

	const handleItemClick = useCallback(
		async (slug: string) => {
			setManualActiveId(slug)

			const newHash = `#${slug}`
			if (location.hash !== newHash) {
				navigate(`${location.pathname}${newHash}`, { replace: true })
			}

			const fakeEvent = { preventDefault: () => {} } as React.MouseEvent
			await scrollIntoView(fakeEvent, slug)
		},
		[location.hash, location.pathname, navigate, setManualActiveId]
	)

	if (items.length === 0) return null

	return (
		<div className="hidden w-56 min-w-min flex-shrink-0 2xl:block">
			<div className="sticky top-37 pb-10">
				<GitHubLinks {...githubLinks} />
				<TableOfContentsHeader />
				<Navigation items={items} activeId={activeId} onItemClick={handleItemClick} />
			</div>
		</div>
	)
}
