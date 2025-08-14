import { cn } from "~/utils/css"
import type { SidebarSection } from "./sidebar"
import { SidebarContent } from "./sidebar-content"

export const DesktopSidebarPanel = ({ items, className }: { items: SidebarSection[]; className: string }) => (
	<div
		className={cn(
			"sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-80 flex-col overflow-hidden bg-[var(--color-background)] p-4",
			className
		)}
	>
		<SidebarContent items={items} />
	</div>
)
