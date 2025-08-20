import { NavLink, href } from "react-router"
import { AccordionItem } from "~/ui/accordion"
import { splitSlug } from "~/utils/split-slug"
import type { SidebarSection } from "./sidebar"

const getIndentClass = (depth: number) => {
	const indentMap = { 0: "ml-0", 1: "ml-4", 2: "ml-8" }
	return indentMap[depth as keyof typeof indentMap] || "ml-8"
}

interface SectionItemProps {
	item: SidebarSection
	depth?: number
	onItemClick?: () => void
}

interface SectionItemLinkProps {
	documentPage: { slug: string; title: string }
	depth: number
	onItemClick?: () => void
}

const SectionTitle = ({ title }: { title: string }) => {
	return <h3 className="mb-3 px-3 font-semibold text-[var(--color-text-active)] text-sm tracking-wide">{title}</h3>
}

const SectionItemLink = ({ documentPage, depth, onItemClick }: SectionItemLinkProps) => {
	const indentClass = getIndentClass(depth)

	return (
		<NavLink
			prefetch="intent"
			to={href("/:version?/:section/:subsection?/:filename", splitSlug(documentPage.slug))}
			onClick={onItemClick}
			className={({ isActive }) =>
				`block rounded-md px-3 py-2 text-sm transition-all duration-200 ${indentClass} ${
					isActive
						? "bg-[var(--color-background-active)] font-medium text-[var(--color-text-active)]"
						: "text-[var(--color-text-normal)] hover:text-[var(--color-text-hover)] hover:text-bold"
				}`
			}
		>
			{documentPage.title}
		</NavLink>
	)
}

export const SectionItem = ({ item, depth = 0, onItemClick }: SectionItemProps) => {
	const isTopLevel = depth === 0

	const content = (
		<div>
			{item.documentationPages.length > 0 && (
				<div className="mb-4 space-y-1">
					{item.documentationPages.map((doc) => (
						<SectionItemLink key={doc.slug} documentPage={doc} depth={depth} onItemClick={onItemClick} />
					))}
				</div>
			)}

			{item.subsections.length > 0 && (
				<div className="space-y-4">
					{item.subsections.map((subsection) => (
						<SectionItem key={subsection.slug} item={subsection} depth={depth + 1} onItemClick={onItemClick} />
					))}
				</div>
			)}
		</div>
	)

	if (isTopLevel) {
		return (
			<AccordionItem
				title={item.title}
				titleElement="h6"
				titleClassName="text-sm font-semibold tracking-wide text-[var(--color-text-active)]"
				content={content}
				defaultOpen={true}
			/>
		)
	}

	return (
		<div className="mb-6">
			<SectionTitle title={item.title} />
			{content}
		</div>
	)
}
