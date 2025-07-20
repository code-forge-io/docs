import { NavLink, href } from "react-router"
import type { Section } from "~/utils/create-sidebar-tree"
import { splitSlug } from "~/utils/split-slug"
import { Accordion, AccordionItem } from "../ui/accordion"

interface SidebarProps {
	items: Section[]
	className?: string
}

const SidebarItem = ({ item, depth = 0 }: { item: Section; depth?: number }) => {
	const indentClass = depth === 0 ? "ml-0" : depth === 1 ? "ml-4" : "ml-8"

	//only use accordion for top-level sections (depth 0)
	if (depth === 0) {
		const content = (
			<div>
				{item.documentationPages.length > 0 && (
					<div className="mb-4 space-y-1">
						{item.documentationPages.map((doc) => {
							const {
								version: docVersion,
								section: docSection,
								subsection: docSubsection,
								fileName: docFileName,
							} = splitSlug(doc.slug)
							return (
								<NavLink
									prefetch="intent"
									key={doc.slug}
									to={href("/docs/:version/:section/:subsection?/:filename", {
										version: docVersion,
										section: docSection,
										subsection: docSubsection,
										filename: docFileName,
									})}
									className={({ isActive }) =>
										`block rounded-md px-3 py-2 text-sm transition-all duration-200 ${indentClass} ${
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

	//for subsections, use regular non-collapsible structure
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
						const {
							version: docVersion,
							section: docSection,
							subsection: docSubsection,
							fileName: docFileName,
						} = splitSlug(doc.slug)
						return (
							<NavLink
								prefetch="intent"
								key={doc.slug}
								to={href("/docs/:version/:section/:subsection?/:filename", {
									version: docVersion,
									section: docSection,
									subsection: docSubsection,
									filename: docFileName,
								})}
								className={({ isActive }) =>
									`block rounded-md px-3 py-2 text-sm transition-all duration-200 ${indentClass} ${
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

export const Sidebar = ({ items, className = "" }: SidebarProps) => {
	return (
		<div className={`sticky top-0 bottom-0 h-screen w-80 flex-col bg-[var(--color-background)] lg:flex ${className} `}>
			<nav className="flex-1 overflow-y-auto p-3" aria-label="Sidebar navigation">
				<Accordion>
					{items.map((item) => (
						<SidebarItem key={item.slug} item={item} />
					))}
				</Accordion>
			</nav>

			<div className=" p-6">
				<div className="text-[var(--color-text-version)] text-xs">
					<p className="font-medium">Version 1.0.1</p>
					<p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
				</div>
			</div>
		</div>
	)
}
