import { allPages } from "content-collections"
import { Outlet } from "react-router"
import { CommandPalette } from "~/components/command-palette/components/command-palette"
import { createCompleteSearchIndex } from "~/components/command-palette/search-index-transform"
import { Header } from "~/components/header"
import { Logo } from "~/components/logo"
import { Sidebar } from "~/components/sidebar/sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { VersionDropdown } from "~/components/versions-dropdown"
import { createSidebarTree } from "~/utils/create-sidebar-tree"
import { resolveLayoutVersion } from "~/utils/version-links"
import type { Route } from "./+types/documentation-layout"

export async function loader({ params, request }: Route.LoaderArgs) {
	const { version } = resolveLayoutVersion(params.version, request)
	const sidebarTree = await createSidebarTree(version)
	return { sidebarTree, version }
}
export default function DocumentationLayout({ loaderData }: Route.ComponentProps) {
	const { sidebarTree, version } = loaderData
	const searchIndex = createCompleteSearchIndex(allPages)

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
				<div className="inline-flex gap-4">
					<ThemeToggle />
					<CommandPalette searchIndex={searchIndex} version={version} />
				</div>
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
