import type { ComponentPropsWithoutRef } from "react"
import { cn } from "~/utils/css"

export const ListItem = (props: ComponentPropsWithoutRef<"li">) => {
	return (
		<li
			{...props}
			className={cn(
				"space-y-1 pl-1 text-[var(--color-text-normal)] [&>li]:ml-2 [&>li]:marker:font-medium",
				props.className
			)}
		/>
	)
}
