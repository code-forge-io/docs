import { cn } from "~/utils/css"
import { DesktopSidebarPanel } from "./desktop-sidebar"
import { MobileSidebarHeader, MobileSidebarOverlay, MobileSidebarPanel } from "./mobile-sidebar"
import { MobileSidebarProvider } from "./mobile-sidebar-context"

export type SidebarSection = {
	title: string
	slug: string
	subsections: SidebarSection[]
	documentationPages: {
		title: string
		slug: string
	}[]
}
interface SidebarProps {
	items: SidebarSection[]
	className?: string
}

export const Sidebar = ({ items, className = "" }: SidebarProps) => {
	return (
		<>
			<DesktopSidebarPanel items={items} className={cn("hidden xl:block", className)} />
			<MobileSidebarProvider>
				<div className="xl:hidden">
					<MobileSidebarHeader />
					<MobileSidebarOverlay />
					<MobileSidebarPanel items={items} className={className} />
				</div>
			</MobileSidebarProvider>
		</>
	)
}
