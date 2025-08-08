import { useLocation } from "react-router"
import { useMobileView } from "~/hooks/use-mobile-view"
import { buildBreadcrumb } from "./build-breadcrumbs"
import { DesktopSidebarPanel } from "./desktop-sidebar"
import { MobileSidebarHeader, MobileSidebarOverlay, MobileSidebarPanel } from "./mobile-sidebar"
import { MobileSidebarProvider } from "./mobile-sidebar-context"

export type SidebarSection = {
	title: string
	slug: string
	sectionId: string
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
	const { isMobile } = useMobileView()
	const location = useLocation()
	const breadcrumbs = buildBreadcrumb(items, location.pathname)

	if (!isMobile) {
		return <DesktopSidebarPanel items={items} className={className} />
	}

	return (
		<MobileSidebarProvider>
			<MobileSidebarHeader breadcrumbs={breadcrumbs} />
			<MobileSidebarOverlay />
			<MobileSidebarPanel items={items} className={className} />
		</MobileSidebarProvider>
	)
}
