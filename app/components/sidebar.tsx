import { NavLink, href, useLocation } from "react-router"
import { useMobileView } from "~/hooks/use-mobile-view"
import { useSidebar } from "~/hooks/use-sidebar"
import { BreadcrumbItem, Breadcrumbs } from "~/ui/breadcrumbs"
import { Icon } from "~/ui/icon/icon"
import type { SidebarSection } from "~/utils/create-sidebar-tree"
import { splitSlug } from "~/utils/split-slug"
import { Accordion, AccordionItem } from "../ui/accordion"

interface SidebarProps {
	items: SidebarSection[]
	className?: string
}

interface SidebarItemProps {
	item: SidebarSection
	depth?: number
	onItemClick?: () => void
}

interface DocumentationLinkProps {
	doc: { slug: string; title: string }
	depth: number
	onItemClick?: () => void
}

//TODO ovo ne radi
const getIndentClass = (depth: number) => {
	const indentMap = { 0: "ml-0", 1: "ml-4", 2: "ml-8" }
	return indentMap[depth as keyof typeof indentMap] || "ml-8"
}

const buildBreadcrumb = (items: SidebarSection[], currentPath: string) => {
	const breadcrumb: string[] = []

	const findInSection = (section: SidebarSection, path: string[]): boolean => {
		for (const doc of section.documentationPages) {
			const { version, section: sectionSlug, subsection, fileName } = splitSlug(doc.slug)
			const docPath = href("/:version/:section/:subsection?/:filename", {
				version,
				section: sectionSlug,
				subsection,
				filename: fileName,
			})

			if (docPath === currentPath) {
				breadcrumb.push(...path, doc.title)
				return true
			}
		}

		for (const subsection of section.subsections) {
			if (findInSection(subsection, [...path, section.title])) {
				return true
			}
		}

		return false
	}

	for (const item of items) {
		if (findInSection(item, [item.title])) break
	}

	return breadcrumb
}

const DocumentationLink = ({ doc, depth, onItemClick }: DocumentationLinkProps) => {
	const { version, section, subsection, fileName } = splitSlug(doc.slug)
	const indentClass = getIndentClass(depth)

	return (
		<NavLink
			prefetch="intent"
			to={href("/:version/:section/:subsection?/:filename", {
				version,
				section,
				subsection,
				filename: fileName,
			})}
			onClick={onItemClick}
			className={({ isActive }) =>
				`block rounded-md px-3 py-2 text-sm transition-transform duration-200 ${indentClass} ${
					isActive
						? "bg-[var(--color-background-active)] font-medium text-[var(--color-text-active)]"
						: "text-[var(--color-text-normal)] hover:text-[var(--color-text-hover)] hover:text-bold"
				}`
			}
		>
			{doc.title}
		</NavLink>
	)
}

const SectionTitle = ({ title, depth }: { title: string; depth: number }) => {
	const indentClass = getIndentClass(depth)

	return (
		<h3 className={`mb-3 font-semibold text-[var(--color-text-active)] text-sm tracking-wide ${indentClass}`}>
			{title}
		</h3>
	)
}

const SidebarItem = ({ item, depth = 0, onItemClick }: SidebarItemProps) => {
	const isTopLevel = depth === 0

	const content = (
		<div>
			{item.documentationPages.length > 0 && (
				<div className="mb-4 space-y-1">
					{item.documentationPages.map((doc) => (
						<DocumentationLink key={doc.slug} doc={doc} depth={depth} onItemClick={onItemClick} />
					))}
				</div>
			)}

			{item.subsections.length > 0 && (
				<div className="space-y-4">
					{item.subsections.map((subsection) => (
						<SidebarItem key={subsection.slug} item={subsection} depth={depth + 1} onItemClick={onItemClick} />
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
				titleClassName={`text-sm font-semibold  tracking-wide text-[var(--color-text-active)] ${getIndentClass(depth)}`}
				content={content}
				defaultOpen={true}
			/>
		)
	}

	return (
		<div className="mb-6">
			<SectionTitle title={item.title} depth={depth} />
			{content}
		</div>
	)
}

const MobileMenuButton = ({ onOpen }: { onOpen: () => void }) => (
	// biome-ignore lint/a11y/useButtonType: <explanation>
	<button
		onClick={onOpen}
		className="px-3 py-2 text-[var(--color-text-normal)] transition-colors duration-200 hover:text-[var(--color-text-hover)]"
		aria-label="Open navigation menu"
	>
		<Icon name="Menu" className="size-5" />
	</button>
)

// const CloseButton = ({ onClose }: { onClose: () => void }) => (
// 	// biome-ignore lint/a11y/useButtonType: <explanation>
// 	<button
// 		onClick={onClose}
// 		className="absolute top-1 right-1 z-10 rounded-full p-2 text-[var(--color-text-normal)] transition-colors duration-200 hover:bg-[var(--color-background-hover)] hover:text-[var(--color-text-hover)]"
// 		aria-label="Close navigation menu"
// 	>
// 		<Icon name="X" className="size-5" />
// 	</button>
// )

const SidebarContent = ({ items, onClose }: { items: SidebarSection[]; onClose?: () => void }) => {
	const { isMobile } = useMobileView()

	return (
		<nav className="flex-1 overflow-y-auto " aria-label="Documentation navigation">
			{/* {isMobile && onClose && <CloseButton onClose={onClose} />} */}

			<Accordion>
				{items.map((item) => (
					<SidebarItem key={item.slug} item={item} onItemClick={isMobile ? onClose : undefined} />
				))}
			</Accordion>
		</nav>
	)
}

const MobileOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
	// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
	<div
		className={`fixed inset-0 z-40 bg-black transition-opacity duration-500 ${
			isOpen ? "opacity-50" : "pointer-events-none opacity-0"
		}`}
		onClick={onClose}
		aria-hidden="true"
	/>
)

const MobileSidebarPanel = ({
	isOpen,
	items,
	onClose,
	className,
}: {
	isOpen: boolean
	items: SidebarSection[]
	onClose: () => void
	className: string
}) => (
	<div
		className={`fixed top-[var(--header-height)] left-0 z-50 h-[calc(100vh-var(--header-height))] w-80 bg-[var(--color-background)] p-4 shadow-xl transition-transform duration-500 ease-in-out ${
			isOpen ? "translate-x-0" : "-translate-x-full"
		} ${className}`}
		// role="dialog"
		aria-modal="true"
		aria-label="Navigation menu"
	>
		<SidebarContent items={items} onClose={onClose} />
	</div>
)

export const Sidebar = ({ items, className = "" }: SidebarProps) => {
	const { isMobile } = useMobileView()
	const { isOpen, open, close } = useSidebar()
	const location = useLocation()
	const breadcrumbPath = buildBreadcrumb(items, location.pathname)

	if (isMobile) {
		return (
			<>
				<div className="fixed z-40 flex w-full items-center gap-3 border-[var(--color-border)] border-b bg-[var(--color-background)] px-4 py-3 ">
					<MobileMenuButton onOpen={open} />
					<Breadcrumbs className="text-sm">
						{breadcrumbPath.map((item) => (
							<BreadcrumbItem key={item}>{item}</BreadcrumbItem>
						))}
					</Breadcrumbs>
				</div>

				<MobileOverlay isOpen={isOpen} onClose={close} />
				<MobileSidebarPanel isOpen={isOpen} items={items} onClose={close} className={className} />
			</>
		)
	}

	return (
		<div
			className={`sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-80 flex-col overflow-hidden bg-[var(--color-background)] p-4 lg:flex ${className}`}
		>
			<SidebarContent items={items} />
		</div>
	)
}
