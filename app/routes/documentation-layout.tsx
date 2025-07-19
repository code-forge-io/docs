import { Outlet } from "react-router"
import { Sidebar } from "~/components/sidebar"
import { getSidebarTree } from "~/utils/create-sidebar-tree"

export default function DocumentationLayout() {
	// TODO think about this exporting from  loader or something so I can get these items from that, to not call the getSIdebarTree on documentation page as well
	const sidebarItems = getSidebarTree("v1.0.1") //TODO use the version what is selected from the dropdown, or latest/main by default

	return (
		<div className="block min-h-screen bg-[var(--color-background)] px-16 lg:flex">
			<Sidebar items={sidebarItems} className="flex-shrink-0" />
			<main className="mx-auto flex-1 p-8">
				<Outlet />
			</main>
		</div>
	)
}
