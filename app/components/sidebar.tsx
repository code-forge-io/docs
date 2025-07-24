import { NavLink, href } from "react-router"
import type { SidebarSection } from "~/utils/create-sidebar-tree"
import { splitSlug } from "~/utils/split-slug"
import { Accordion, AccordionItem } from "../ui/accordion"

interface SidebarProps {
	items: SidebarSection[]
	className?: string
}

//TODO maybe refactor this a little bit to not duplicate the code
const SidebarItem = ({ item, depth = 0 }: { item: SidebarSection; depth?: number }) => {
	const indentClass = depth === 0 ? "ml-0" : depth === 1 ? "ml-4" : "ml-8"

	//we only use accordion for top-level sections (depth 0), not for the subsections
	if (depth === 0) {
		const content = (
			<div>
				{item.documentationPages.length > 0 && (
					<div className="mb-4 space-y-1">
						{item.documentationPages.map((doc) => {
							const { version, section, subsection, fileName: filename } = splitSlug(doc.slug)
							return (
								<NavLink
									prefetch="intent"
									key={doc.slug}
									to={href("/docs/:version/:section/:subsection?/:filename", {
										version,
										section,
										subsection,
										filename,
									})}
									className={({ isActive }) =>
										`block rounded-md px-3 py-1.5 text-sm transition-all duration-200 ${indentClass} ${
											isActive
												? "border-[var(--color-code-inline-text)] border-l-2 bg-[var(--color-background-active)] font-medium text-[var(--color-text-active)]"
												: "text-[var(--color-text-normal)] hover:bg-[var(--color-background-hover)] hover:text-[var(--color-text-hover)]"
										}`
									}
								>
									{doc.title}
								</NavLink>
							)
						})}
					</div>
				)}

				{item.subsections.length > 0 && (
					<div className="space-y-4">
						{item.subsections.map((sub) => (
							<SidebarItem key={sub.slug} item={sub} depth={depth + 1} />
						))}
					</div>
				)}
			</div>
		)

		return (
			<div className="">
				<AccordionItem
					title={item.title}
					titleElement="h6"
					titleClassName={`font-semibold text-[var(--color-text-active)] text-sm uppercase tracking-wide ${indentClass}`}
					content={content}
					defaultOpen={true}
				/>
			</div>
		)
	}

	//for subsections we use regular non-collapsible structure
	return (
		<div className="mb-6">
			<h3
				className={`mb-3 font-semibold text-[var(--color-text-active)] text-sm uppercase tracking-wide ${indentClass}`}
			>
				{item.title}
			</h3>

			{item.documentationPages.length > 0 && (
				<div className="mb-4 space-y-1">
					{item.documentationPages.map((doc) => {
						const { version, section, subsection, fileName: filename } = splitSlug(doc.slug)
						return (
							<NavLink
								prefetch="intent"
								key={doc.slug}
								to={href("/docs/:version/:section/:subsection?/:filename", {
									version,
									section,
									subsection,
									filename,
								})}
								className={({ isActive }) =>
									`block rounded-md px-3 py-1.5 text-sm transition-all duration-200 ${indentClass} ${
										isActive
											? "border-[var(--color-code-inline-text)] border-l-2 bg-[var(--color-background-active)] font-medium text-[var(--color-text-active)]"
											: "text-[var(--color-text-normal)] hover:bg-[var(--color-background-hover)] hover:text-[var(--color-text-hover)]"
									}`
								}
							>
								{doc.title}
							</NavLink>
						)
					})}
				</div>
			)}

			{item.subsections.length > 0 && (
				<div className="space-y-4">
					{item.subsections.map((sub) => (
						<SidebarItem key={sub.slug} item={sub} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	)
}

/**
 * A recursive sidebar navigation component displaying a documentation
 * sidebar tree with nested sections and pages.
 *
 * Top-level sections (depth 0) are rendered inside collapsible accordions,
 * while subsections (depth == 1) are rendered as simple headings with
 * indented links.
 *
 * Each documentation page is rendered as a `NavLink` with active link styling,
 * and URLs are generated dynamically from the page slug.
 *
 * The sidebar also includes a sticky layout with a version and last updated
 * info block at the bottom.
 *
 * Example usage:
 * <Sidebar items={sidebarSections} className="custom-sidebar-class" />
 *
 * @param items - An array of documentation sections with nested pages and subsections.
 * @param className - Optional additional CSS classes for the sidebar container.
 */
export const Sidebar = ({ items, className = "" }: SidebarProps) => {
	return (
		<div className={`sticky top-16 bottom-0 h-screen w-80 flex-col bg-[var(--color-background)] lg:flex ${className} `}>
			<nav className=" h-32 flex-1 overflow-y-auto pr-2" aria-label="Sidebar navigation">
				<Accordion>
					{items.map((item) => (
						<SidebarItem key={item.slug} item={item} />
					))}
				</Accordion>
			</nav>

			{/* <div className="p-6"> */}
			{/* <div className="text-[var(--color-text-version)] text-xs"> */}
			{/* TODO remove this hardcoded version */}
			{/* <p className="font-medium">{t("p.version")} 1.0.1</p> */}
			{/* <p className="mt-1">
						{t("p.last_update")} {new Date().toLocaleDateString()}
					</p> */}
			{/* </div> */}
			{/* </div> */}
		</div>
	)
}
