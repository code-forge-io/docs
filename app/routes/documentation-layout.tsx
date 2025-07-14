import { Outlet } from "react-router"
import { Sidebar } from "~/components/sidebar"
import { getSidebarTree } from "~/utils/content-collections"

export default function DocumentationLayout() {
	const sidebarItems = getSidebarTree("v1.0.1") //TODO use the version what is selected from the dropdown, or latest/main by default

	return (
		<div className="flex min-h-screen">
			<Sidebar items={sidebarItems} className="flex-shrink-0" />
			<main className="flex-1 p-8">
				<Outlet />
			</main>
		</div>
	)
}
