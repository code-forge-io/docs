import type { Page } from "content-collections"
import { useMobileView } from "~/hooks/use-mobile-view"
import { Accordion } from "~/ui/accordion"
import type { SidebarSection } from "./sidebar"
import { SectionItem } from "./sidebar-section"
import { StandaloneItemLink } from "./standalone-item-link"

export const SidebarContent = ({
	items,
	documentationPages = [],
	onClose,
}: {
	items: SidebarSection[]
	documentationPages?: Page[]
	onClose?: () => void
}) => {
	const { isMobile } = useMobileView()
	const handle = isMobile ? onClose : undefined

	return (
		<nav
			className="max-h-[calc(100vh-var(--header-height))] min-h-0 flex-1 overflow-y-auto pr-4"
			aria-label="Documentation navigation"
		>
			{/* Standalone top-level docs FIRST */}
			{documentationPages.length > 0 && (
				<div className="mb-6 space-y-1">
					{documentationPages.map((p) => (
						<StandaloneItemLink key={p.slug} page={p} onItemClick={handle} />
					))}
				</div>
			)}

			{/* Then the section tree (unchanged) */}
			<Accordion>
				{items.map((item) => (
					<SectionItem key={item.slug} item={item} onItemClick={handle} />
				))}
			</Accordion>
		</nav>
	)
}
