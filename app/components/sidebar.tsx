import { NavLink, href } from "react-router"
import type { Section } from "~/utils/create-sidebar-tree"
import { splitSlug } from "~/utils/split-slug"

interface SidebarProps {
	items: Section[]
	className?: string
}

const SidebarItem = ({ item, depth = 0 }: { item: Section; depth?: number }) => {
	const indentClass = depth === 0 ? "ml-0" : depth === 1 ? "ml-4" : "ml-8"

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
						const { version: docVersion, section: docSection, fileName: docFileName } = splitSlug(doc.slug)
						return (
							<NavLink
								prefetch="intent"
								key={doc.slug}
								to={href("/docs/:version/:section/:filename", {
									version: docVersion,
									section: docSection,
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
			<nav className="flex-1 overflow-y-auto p-6" aria-label="Sidebar navigation">
				<div className="space-y-8">
					{items.map((item) => (
						<SidebarItem key={item.slug} item={item} />
					))}
				</div>
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
