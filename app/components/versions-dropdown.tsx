import { useState } from "react"
import { useNavigate } from "react-router"
import { Icon } from "~/ui/icon/icon"
import { versions } from "~/utils/versions"
import { hrefForHomepage, isKnownVersion, useCurrentVersion } from "~/utils/versions-utils"

export function VersionDropdown() {
	const navigate = useNavigate()
	const current = useCurrentVersion()
	const [selectedVersion, setSelectedVersion] = useState(current)

	function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const next = e.target.value
		if (next === current) return

		setSelectedVersion(isKnownVersion(next) ? next : current)

		const to = hrefForHomepage(next)
		const nav = () => navigate(to, { preventScrollReset: true })
		if (document.startViewTransition) document.startViewTransition(nav)
		else nav()
	}

	return (
		<div className="relative inline-block text-[var(--color-text-normal)] hover:text-[var(--color-text-muted)]">
			<select
				id="version"
				name="version"
				className="cursor-pointer appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2.5 pr-10 pl-4 font-medium text-sm transition-all duration-200 focus:outline-none"
				value={selectedVersion}
				onChange={onChange}
			>
				{versions.map((v) => (
					<option key={v} value={v} className="bg-[var(--color-background)] py-2 text-[var(--color-text-normal)]">
						{v}
					</option>
				))}
			</select>
			<Icon
				name="ChevronDown"
				className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 h-4 w-4 text-[var(--color-text-muted)] transition-colors duration-200"
			/>
		</div>
	)
}
