import { NavLink, href, useRouteLoaderData } from "react-router"
import type { loader } from "~/root"
import { AccordionItem } from "~/ui/accordion"
import { splitSlug } from "~/utils/split-slug"
import { versions } from "~/utils/versions"
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
	return (
		<h3 className="mb-3 px-3 font-semibold text-[var(--color-text-active)] text-sm tracking-wide sm:text-base md:text-lg">
			{title}
		</h3>
	)
}

const SectionItemLink = ({ documentPage, depth, onItemClick }: SectionItemLinkProps) => {
	const data = useRouteLoaderData<typeof loader>("root")
	const version = data?.version ?? versions[0]
	const indentClass = getIndentClass(depth)
	const { section, subsection, filename } = splitSlug(documentPage.slug)
	return (
		<NavLink
			prefetch="intent"
			to={href("/:version/:section/:subsection?/:filename", { version, section, subsection, filename })}
			onClick={onItemClick}
			className={({ isActive, isPending }) =>
				`block rounded-md px-3 py-2 text-xs sm:text-sm md:text-base ${indentClass}
			${isPending ? "text-[var(--color-text-hover)]" : ""}
			${
				isActive
					? "bg-[var(--color-background-active)] font-medium text-[var(--color-text-active)]"
					: "text-[var(--color-text-normal)] hover:text-[var(--color-text-hover)]"
			}
				`
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
				titleElement="h4"
				titleClassName=" font-semibold tracking-wide text-[var(--color-text-active)]"
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
