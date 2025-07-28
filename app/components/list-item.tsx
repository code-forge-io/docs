import type { ComponentPropsWithoutRef } from "react"

export const ListItem = (props: ComponentPropsWithoutRef<"li">) => {
	return (
		<li
			{...props}
			className={`space-y-1 pl-1 text-[var(--color-text-normal)] [&>li]:ml-2 [&>li]:marker:font-medium ${props.className ?? ""}`}
		/>
	)
}
