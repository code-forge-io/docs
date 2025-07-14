import { NavLink, href } from "react-router"
import type { Section } from "~/utils/content-collections"
import { splitSlug } from "~/utils/split-slug"

interface SidebarProps {
	items: Section[]
	className?: string
}

const SidebarItem = ({ item, depth = 0 }: { item: Section; depth?: number }) => {
	const paddingLeft = 16 + depth * 16
	// TODO fix styling eg this padding Left looks bad, spacing-y also looks so bad between sections and subsections
	return (
		<div className="relative">
			{/* TODO don't use p, use custom Text/Title component */}
			<p
				key={item.slug}
				style={{ paddingLeft: paddingLeft + 16 }}
				className="block px-4 py-2 text-[var(--color-text-normal)] text-sm uppercase"
			>
				{item.title}
			</p>

			{item.documentationPages.length > 0 && (
				<div className="mt-1 space-y-1">
					{item.documentationPages.map((doc) => {
						const { version: docVersion, section: docSection, fileName: docFileName } = splitSlug(doc.slug)
						return (
							<NavLink
								key={doc.slug}
								to={href("/docs/:version/:section/:filename", {
									version: docVersion,
									section: docSection,
									filename: docFileName,
								})}
								className={({ isActive }) =>
									`block rounded-md px-4 py-1 text-[var(--color-text-normal)] text-sm transition-all duration-200 hover:bg-[var(--color-background-hover)] hover:text-[var(--color-text-hover)] ${isActive ? "font-semibold text-[var(--color-text-active)]" : "font-normal"}`
								}
								style={{ paddingLeft: paddingLeft + 24 }}
							>
								{doc.title}
							</NavLink>
						)
					})}
				</div>
			)}

			{item.subsections.length > 0 && (
				<div className="mt-1 space-y-1">
					{item.subsections.map((sub) => (
						<SidebarItem key={sub.slug} item={sub} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	)
}

export const Sidebar = ({ items, className = "" }: SidebarProps) => {
	//TODO add mobile view

	return (
		<>
			<div
				className={`fixed inset-y-0 left-0 z-50 flex w-80 transform flex-col border-[var(--color-border)] border-r bg-[var(--color-background)] transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:translate-x-0 h-full${className}
        `}
			>
				<nav className="flex-1 overflow-y-auto p-4" aria-label="Sidebar navigation">
					{items.map((item) => (
						<SidebarItem key={item.slug} item={item} />
					))}
				</nav>

				<div className="border-[var(--color-border)] border-t p-4 text-[var(--color-text-version)] text-xs">
					<p>v1.0.1</p>
					<p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
					{/* TODO remove this hardcoded version */}
				</div>
			</div>
		</>
	)
}
