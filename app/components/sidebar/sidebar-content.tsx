import { useMobileView } from "~/hooks/use-mobile-view"
import { Accordion } from "~/ui/accordion"
import type { SidebarSection } from "./sidebar"
import { SectionItem } from "./sidebar-section"

export const SidebarContent = ({ items, onClose }: { items: SidebarSection[]; onClose?: () => void }) => {
	const { isMobile } = useMobileView()

	return (
		<nav
			className="max-h-[calc(100vh-var(--header-height))] min-h-0 flex-1 overflow-y-auto"
			aria-label="Documentation navigation"
		>
			<Accordion>
				{items.map((item) => (
					<SectionItem key={item.slug} item={item} onItemClick={isMobile ? onClose : undefined} />
				))}
			</Accordion>
		</nav>
	)
}
