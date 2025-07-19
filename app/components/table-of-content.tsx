import { scrollIntoView } from "~/utils/scroll-into-view"
import type { HeadingItem } from "~/utils/table-of-content"

interface TableOfContentsProps {
	items: HeadingItem[]
	className?: string
}

const TocItem = ({ item, depth = 0 }: { item: HeadingItem; depth?: number }) => {
	const paddingLeft = 12 + depth * 16

	return (
		<div>
			<a
				href={`#${item.slug}`}
				style={{ paddingLeft }}
				className={`block border-transparent border-l py-1.5 text-sm transition-all duration-200 hover:border-[var(--color-code-inline-text)] hover:text-[var(--color-text-hover)] ${
					depth === 0 ? "font-medium text-[var(--color-text-active)]" : "text-[var(--color-text-normal)]"
				}`}
				onClick={(e) => scrollIntoView(e, item.slug)}
			>
				{item.title}
			</a>
			{item.children.length > 0 && (
				<div className="space-y-0.5">
					{item.children.map((child) => (
						<TocItem key={child.slug} item={child} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	)
}

export const TableOfContents = ({ items, className = "" }: TableOfContentsProps) => {
	if (items.length === 0) {
		return null
	}

	return (
		<nav aria-label="Table of contents" className={`fixed top-14 ${className}`}>
			<div className="rounded-lg bg-[var(--color-background)] p-4">
				<h2 className="mb-2 pb-2 font-semibold text-[var(--color-text-active)] text-sm">On this page</h2>
				<div className="max-h-[calc(100vh-12rem)] space-y-1 overflow-y-auto border-[var(--color-border)] border-l">
					{items.map((item) => (
						<TocItem key={item.slug} item={item} />
					))}
				</div>
			</div>
		</nav>
	)
}
