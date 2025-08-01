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

const getIndentClass = (depth: number) => {
	const indentMap = { 0: "ml-0", 1: "ml-4", 2: "ml-8" }
	return indentMap[depth as keyof typeof indentMap] || "ml-8"
}

const buildBreadcrumb = (items: SidebarSection[], currentPath: string) => {
	const breadcrumb: string[] = []
	const findBreadcrumb = (section: SidebarSection, path: string[]): boolean => {
		if (
			section.documentationPages.some((doc) => {
				const docPath = href("/:version/:section/:subsection?/:filename", splitSlug(doc.slug))
				if (docPath === currentPath) {
					breadcrumb.push(...path, doc.title)
					return true
				}
				return false
			})
		) {
			return true
		}
		return section.subsections.some((sub) => findBreadcrumb(sub, [...path, section.title]))
	}
	items.some((item) => findBreadcrumb(item, [item.title]))
	return breadcrumb
}

const DocumentationLink = ({ doc, depth, onItemClick }: DocumentationLinkProps) => {
	const indentClass = getIndentClass(depth)

	return (
		<NavLink
			prefetch="intent"
			to={href("/:version/:section/:subsection?/:filename", splitSlug(doc.slug))}
			onClick={onItemClick}
			className={({ isActive }) =>
				`block rounded-md px-3 py-2 text-sm transition-all duration-200 ${indentClass} ${
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
	<button
		type="button"
		onClick={onOpen}
		className="px-3 py-2 text-[var(--color-text-normal)] transition-colors duration-200 hover:text-[var(--color-text-hover)]"
		aria-label="Open navigation menu"
	>
		<Icon name="Menu" className="size-5" />
	</button>
)

const CloseButton = ({ onClose }: { onClose: () => void }) => (
	<button
		type="button"
		onClick={onClose}
		className="absolute top-1 right-1 z-10 rounded-full p-2 text-[var(--color-text-normal)] transition-colors duration-200 hover:text-[var(--color-text-hover)]"
		aria-label="Close navigation menu"
	>
		<Icon name="X" className="size-5" />
	</button>
)

const SidebarContent = ({ items, onClose }: { items: SidebarSection[]; onClose?: () => void }) => {
	const { isMobile } = useMobileView()

	return (
		<nav className="flex-1 overflow-y-auto " aria-label="Documentation navigation">
			<Accordion>
				{items.map((item) => (
					<SidebarItem key={item.slug} item={item} onItemClick={isMobile ? onClose : undefined} />
				))}
			</Accordion>
		</nav>
	)
}

const MobileOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
	// biome-ignore lint/a11y/useKeyWithClickEvents: We don't need
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
		className={`fixed left-0 z-50 h-[calc(100vh-var(--header-height))] w-80 border-[var(--color-border)] border-t bg-[var(--color-background)] p-4 transition-transform duration-500 ease-in-out ${
			isOpen ? "translate-x-0" : "-translate-x-full"
		} ${className}`}
		aria-modal="true"
		aria-label="Navigation menu"
	>
		<SidebarContent items={items} onClose={onClose} />
		<CloseButton onClose={onClose} />
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
				<div className="fixed top-[var(--header-height)] z-40 flex w-full items-center gap-3 border-[var(--color-border)] border-b bg-[var(--color-background)] px-4 py-3 ">
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
