import { Outlet } from "react-router"
import { Header } from "~/components/header"
import { Logo } from "~/components/logo"
import { Sidebar } from "~/components/sidebar/sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { VersionDropdown } from "~/components/versions-dropdown"
import { createSidebarTree } from "~/utils/create-sidebar-tree"
import { resolveVersionForLayout } from "~/utils/version-resolvers"
import type { Route } from "./+types/documentation-layout"

export async function loader({ params, request }: Route.LoaderArgs) {
	const { version } = resolveVersionForLayout(params.version, request)
	const sidebarTree = await createSidebarTree(version)
	return { sidebarTree, version }
}
export default function DocumentationLayout({ loaderData }: Route.ComponentProps) {
	const { sidebarTree } = loaderData

	return (
		<div className="block min-h-screen bg-[var(--color-background)] 2xl:container 2xl:mx-auto">
			<Header>
				<div className="flex items-start gap-3">
					<Logo>
						{/* Replace with your Logo */}
						<span className="p-0">REACT ROUTER DEVTOOLS</span>
					</Logo>
					<VersionDropdown />
				</div>
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
