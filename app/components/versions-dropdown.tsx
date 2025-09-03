import { useState } from "react"
import { useNavigate } from "react-router"
import { Icon } from "~/ui/icon/icon"
import { getCurrentVersion, homepageUrlWithVersion, isKnownVersion } from "~/utils/version-resolvers"
import { versions } from "~/utils/versions"

export function VersionDropdown() {
	const navigate = useNavigate()
	const { version: currentVersion } = getCurrentVersion()
	const [selectedVersion, setSelectedVersion] = useState(currentVersion)

	function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
		const next = e.target.value
		if (next === currentVersion) return

		setSelectedVersion(isKnownVersion(next) ? next : currentVersion)

		const to = homepageUrlWithVersion(next)
		const nav = () => {
			navigate(to)
			e.target.blur()
		}
		if (document.startViewTransition) document.startViewTransition(nav)
		else nav()
	}

	return (
		<div className="relative inline-block text-[var(--color-text-normal)]">
			<select
				id="version"
				name="version"
				className="cursor-pointer appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-2.5 pr-10 pl-4 font-medium text-sm shadow-sm transition-all duration-200 hover:bg-[var(--color-border)] focus:border-transparent focus:bg-[var(--color-border)] focus:outline-none focus:ring-none"
				value={selectedVersion}
				onChange={onChange}
				aria-label="Select documentation version"
			>
				{versions.map((v) => (
					<option
						key={v}
						value={v}
						className={`bg-[var(--color-background)] text-[var(--color-text-normal)] hover:bg-[var(--color-background-hover)]${selectedVersion === v ? "font-semibold text-[var(--color-text-active)]" : ""}
						`}
					>
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
