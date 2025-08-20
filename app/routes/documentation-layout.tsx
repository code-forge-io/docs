import { Outlet } from "react-router"
import { Header } from "~/components/header"
import { Logo } from "~/components/logo"
import { Sidebar } from "~/components/sidebar/sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { VersionDropdown } from "~/components/versions-dropdown"
import { createSidebarTree } from "~/utils/create-sidebar-tree"
import { getLatestVersion, isKnownVersion } from "~/utils/versions-utils"
import type { Route } from "./+types/documentation-layout"

export async function loader({ params, request }: Route.LoaderArgs) {
	let paramsVersion = params.version

	if (!paramsVersion) {
		const first = new URL(request.url).pathname.split("/").filter(Boolean)[0]
		if (isKnownVersion(first)) paramsVersion = first
	}

	const version = isKnownVersion(paramsVersion) ? paramsVersion : getLatestVersion()
	return { sidebarTree: await createSidebarTree(version), version }
}
export default function DocumentationLayout({ loaderData }: Route.ComponentProps) {
	const { sidebarTree } = loaderData
	return (
		<div className="block min-h-screen bg-[var(--color-background)] 2xl:container 2xl:mx-auto">
			<Header>
				<div className="flex items-center gap-3">
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
