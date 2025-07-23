import { Outlet } from "react-router"
import { Header } from "~/components/header"
import { Logo } from "~/components/logo"
import { Sidebar } from "~/components/sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { getSidebarTree } from "~/utils/create-sidebar-tree"

export default function DocumentationLayout() {
	// TODO think about this exporting from  loader or something so I can get these items from that, to avoid calling the getSidebarTree in documentation-page as well
	const sidebarItems = getSidebarTree("v1.0.1") //TODO use the version what is selected from the dropdown, or latest/main by default
	return (
		<div className="block min-h-screen bg-[var(--color-background)]">
			<Header>
				<Logo />
				<ThemeToggle />
			</Header>
			<div className="xl:flex">
				<div className="mx-4 flex min-h-screen lg:mx-8 xl:mx-12 2xl:mx-20">
					<Sidebar items={sidebarItems} className="flex-shrink-0" />
					<main className="mx-auto flex-1">
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	)
}
