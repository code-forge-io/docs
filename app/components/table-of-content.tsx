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

const TocItem = ({
	item,
	depth = 0,
	activeId,
	onItemClick,
}: {
	item: HeadingItem
	depth?: number
	activeId: string | null
	onItemClick: (slug: string) => Promise<void>
}) => {
	const paddingLeft = 12 + depth * 16
	const isActive = activeId === item.slug

	return (
		<div>
			<a
				href={`#${item.slug}`}
				style={{ paddingLeft }}
				className={`block py-1.5 text-sm transition-all duration-200 hover:text-[var(--color-text-hover)] ${
					depth === 0 ? "font-medium" : ""
				} ${
					isActive
						? "border-[var(--color-text-accent)] font-bold text-[var(--color-text-accent)]"
						: "border-transparent text-[var(--color-text-normal)]"
				}`}
				onClick={async (e) => {
					e.preventDefault()
					await onItemClick(item.slug)
				}}
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

export const TableOfContents = ({ items, pagePath }: TableOfContentsProps) => {
	const location = useLocation()
	const { activeId, setManualActiveId } = useActiveHeadingId(undefined, location.pathname)
	const navigate = useNavigate()
	const { clientEnv } = useRouteLoaderData("root")
	const { GITHUB_OWNER, GITHUB_REPO } = clientEnv

	const { editUrl, issueUrl } = createGitHubContributionLinks({
		pagePath,
		owner: GITHUB_OWNER,
		repo: GITHUB_REPO,
	})

	const handleItemClick = async (slug: string): Promise<void> => {
		// Immediately set the active ID to provide instant visual feedback
		setManualActiveId(slug)

		// Update URL
		const newHash = `#${slug}`
		if (location.hash !== newHash) {
			navigate(`${location.pathname}${newHash}`, { replace: true })
		}

		// Scroll to the element
		const fakeEvent = { preventDefault: () => {} } as React.MouseEvent
		await scrollIntoView(fakeEvent, slug, -80)
	}

	if (items.length === 0) return null

	// TODO use i18next for transltions
	return (
		<div className="hidden w-56 min-w-min flex-shrink-0 2xl:block">
			<div className="sticky top-37 pb-10">
				<div className="mb-10 flex flex-col gap-3 text-[var(--color-text-active)] text-sm">
					<a
						href={issueUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-[var(--color-text-accent)] hover:underline"
					>
						Report an issue with this page
					</a>
					<a
						href={editUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-[var(--color-text-accent)] hover:underline"
					>
						Edit this page
					</a>
				</div>

				<h2 className="mb-4 border-[var(--color-border)] border-b pb-2 font-semibold text-[var(--color-text-active)] text-base">
					On this page
				</h2>

				<nav
					aria-label="Table of contents"
					className="-mr-4 max-h-[calc(100vh-var(--header-height))] overflow-y-auto pr-4"
				>
					<div className="space-y-1 pb-8">
						{items.map((item) => (
							<TocItem key={item.slug} item={item} activeId={activeId} onItemClick={handleItemClick} />
						))}
					</div>
				</nav>
			</div>
		</div>
	)
}
