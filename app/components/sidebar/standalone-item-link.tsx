import type { Page } from "content-collections"
import { NavLink, href, useRouteLoaderData } from "react-router"
import type { loader } from "~/root"
import { versions } from "~/utils/versions"

export const StandaloneItemLink = ({
	page,
	onItemClick,
}: {
	page: Page
	onItemClick?: () => void
}) => {
	const data = useRouteLoaderData<typeof loader>("root")
	const version = data?.version ?? versions[0]

	// standalone route: /:version?/:filename
	const filename = page.slug.split("/").filter(Boolean).at(-1) ?? page.slug

	return (
		<NavLink
			prefetch="intent"
			to={href("/:version?/:filename", { version, filename })}
			onClick={onItemClick}
			className={({ isActive, isPending }) =>
				`block rounded-md px-3 py-2 text-xs sm:text-sm md:text-base ${isPending ? "text-[var(--color-text-hover)]" : ""}
         ${
						isActive
							? "bg-[var(--color-background-active)] font-medium text-[var(--color-text-active)]"
							: "text-[var(--color-text-normal)] hover:text-[var(--color-text-hover)]"
					}`
			}
		>
			{page.title}
		</NavLink>
	)
}
