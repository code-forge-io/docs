import type { Page } from "content-collections"
import { cn } from "~/utils/css"
import type { SidebarSection } from "./sidebar"
import { SidebarContent } from "./sidebar-content"

export const DesktopSidebarPanel = ({
	items,
	documentationPages,
	className,
}: { items: SidebarSection[]; documentationPages: Page[]; className: string }) => (
	<div
		className={cn(
			"sticky top-[var(--header-height)] flex h-[calc(100vh-var(--header-height))] w-80 flex-col overflow-hidden bg-[var(--color-background)] p-4",
			className
		)}
	>
		<SidebarContent items={items} documentationPages={documentationPages} />
	</div>
)
