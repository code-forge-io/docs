import { allPages } from "content-collections"
import { Outlet, useNavigate } from "react-router"
import CommandPalette from "~/components/command-palette/components/command-palette"
import { createCompleteSearchIndex } from "~/components/command-palette/search-index-transform"
import { Header } from "~/components/header"
import { Logo } from "~/components/logo"
import { Sidebar } from "~/components/sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { getSidebarTree } from "~/utils/create-sidebar-tree"

export default function DocumentationLayout() {
	// TODO think about this exporting from  loader or something so I can get these items from that, to avoid calling the getSidebarTree in documentation-page as well
	const sidebarItems = getSidebarTree("v1.0.1") //TODO use the version what is selected from the dropdown, or latest/main by default
	const searchIndex = createCompleteSearchIndex(allPages)
	const navigate = useNavigate()

	return (
		<div className="block min-h-screen bg-[var(--color-background)] 2xl:container 2xl:mx-auto">
			<Header>
				<Logo>
					{/* FIXME replace with your Logo */}
					<span>REACT ROUTER DEVTOOLS</span>
				</Logo>
				<div className="inline-flex gap-4">
					<ThemeToggle />
					<CommandPalette searchIndex={searchIndex} onNavigate={(item) => navigate(item.slug)} />
				</div>
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
