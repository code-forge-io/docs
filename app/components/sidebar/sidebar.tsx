import { useLocation } from "react-router"
import { cn } from "~/utils/css"
import { buildBreadcrumb } from "./build-breadcrumbs"
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
	const location = useLocation()
	const breadcrumbs = buildBreadcrumb(items, location.pathname)

	return (
		<>
			<DesktopSidebarPanel items={items} className={cn("hidden xl:block", className)} />

			<MobileSidebarProvider>
				<div className="xl:hidden">
					<MobileSidebarHeader breadcrumbs={breadcrumbs} />
					<MobileSidebarOverlay />
					<MobileSidebarPanel items={items} className={className} />
				</div>
			</MobileSidebarProvider>
		</>
	)
}
