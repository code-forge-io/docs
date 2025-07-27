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

			{/* Flex wrapper: sidebar + main */}
			<div className="xl:flex">
				{/* Sidebar - no margin here */}
				<Sidebar items={sidebarItems} className="flex-shrink-0" />

				{/* Main content - apply responsive margin/padding here only */}
				<main className="mx-4 flex-1 pt-10 pb-16 lg:mx-8 xl:mx-12 2xl:mx-20">
					<Outlet />
				</main>
			</div>
		</div>
	)
}
