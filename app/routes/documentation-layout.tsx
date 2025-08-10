import { Outlet } from "react-router"
import { Header } from "~/components/header"
import { Logo } from "~/components/logo"
import { Sidebar } from "~/components/sidebar/sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { createSidebarTree } from "~/utils/create-sidebar-tree"

export default function DocumentationLayout() {
	// TODO sidebarItems are used on 2 places, change this to not call getSidebarTree twice
	const sidebarItems = createSidebarTree("v1.0.1") //TODO use the version what is selected from the dropdown, after implementing docs generation
	return (
		<div className="block min-h-screen bg-[var(--color-background)] 2xl:container 2xl:mx-auto">
			<Header>
				<Logo>
					{/* Replace with your Logo */}
					<span>REACT ROUTER DEVTOOLS</span>
				</Logo>
				<ThemeToggle />
			</Header>

			<div className="xl:flex">
				<Sidebar items={sidebarItems} className="flex-shrink-0" />
				<main className="mx-4 flex-1 pt-10 pb-16 lg:mx-8">
					<Outlet />
				</main>
			</div>
		</div>
	)
}
