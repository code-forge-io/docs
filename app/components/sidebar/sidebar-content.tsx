import { useMobileView } from "~/hooks/use-mobile-view"
import { Accordion } from "~/ui/accordion"
import type { SidebarTree } from "~/utils/create-sidebar-tree"
import { SectionItem } from "./sidebar-section"
import { StandaloneItemLink } from "./standalone-item-link"

export const SidebarContent = ({
	sidebarTree,
	onClose,
}: {
	sidebarTree: SidebarTree
	onClose?: () => void
}) => {
	const { isMobile } = useMobileView()
	const handle = isMobile ? onClose : undefined
	const { sections, documentationPages } = sidebarTree
	return (
		<nav
			className="max-h-[calc(100vh-var(--header-height))] min-h-0 flex-1 overflow-y-auto pr-4"
			aria-label="Documentation navigation"
		>
			{documentationPages.length > 0 && (
				<div className="mb-6 space-y-1">
					{documentationPages.map((p) => (
						<StandaloneItemLink key={p.slug} page={p} onItemClick={handle} />
					))}
				</div>
			)}

			<Accordion>
				{sections.map((item) => (
					<SectionItem key={item.slug} item={item} onItemClick={handle} />
				))}
			</Accordion>
		</nav>
	)
}
