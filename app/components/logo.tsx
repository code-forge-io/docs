import type { ReactNode } from "react"

export const Logo = ({ children }: { children: ReactNode }) => {
	return (
		<div className="relative block font-semibold font-space text-[var(--color-text-active)] text-lg md:text-2xl xl:text-3xl">
			{children}
		</div>
	)
}
