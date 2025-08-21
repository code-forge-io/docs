import { Outlet } from "react-router"
import { Header } from "~/components/header"
import { Logo } from "~/components/logo"
import { Sidebar } from "~/components/sidebar/sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { createSidebarTree } from "~/utils/create-sidebar-tree"
import type { Route } from "./+types/documentation-layout"

export async function loader() {
	return { sidebarTree: createSidebarTree() }
}

export default function DocumentationLayout({ loaderData }: Route.ComponentProps) {
	const { sidebarTree } = loaderData
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
				<Sidebar items={sidebarTree} className="flex-shrink-0" />
				<main className="mx-4 flex-1 pt-10 pb-16 lg:mx-8">
					<Outlet />
				</main>
			</div>
		</div>
	)
}
