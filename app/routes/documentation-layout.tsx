import { Outlet } from "react-router"
import { CommandK } from "~/components/command-k/components/command-k"
import { createSearchIndex } from "~/components/command-k/create-search-index"
import { Header } from "~/components/header"
import { Logo } from "~/components/logo"
import { Sidebar } from "~/components/sidebar/sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { VersionDropdown } from "~/components/versions-dropdown"
import { createSidebarTree } from "~/utils/create-sidebar-tree"
import { loadContentCollections } from "~/utils/load-content-collections"
import { resolveVersionForLayout } from "~/utils/version-resolvers"
import type { Route } from "./+types/documentation-layout"

export async function loader({ params, request }: Route.LoaderArgs) {
	const { version } = resolveVersionForLayout(params.version, request)
	const sidebarTree = await createSidebarTree(version)
	const { allPages } = await loadContentCollections(version)
	return { sidebarTree, version, allPages }
}
export default function DocumentationLayout({ loaderData }: Route.ComponentProps) {
	const { sidebarTree, version, allPages } = loaderData
	const searchIndex = createSearchIndex(allPages)
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
					<CommandK searchIndex={searchIndex} version={version} />
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
