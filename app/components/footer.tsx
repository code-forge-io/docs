import { useRouteLoaderData } from "react-router"

export function Footer() {
	// TODO use i18next for translations
	const { clientEnv } = useRouteLoaderData("root")
	const { GITHUB_OWNER } = clientEnv

	return (
		<footer className="bottom-0 mt-auto flex flex-col items-center gap-2 p-6 pt-12 text-[var(--color-text-active)] text-sm">
			<div className="mt-2 text-[var(--color-text-active)] text-xs">
				© {new Date().getFullYear()} {GITHUB_OWNER}. All rights reserved.
			</div>
		</footer>
	)
}
