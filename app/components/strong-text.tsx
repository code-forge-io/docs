import type { ComponentPropsWithoutRef } from "react"

export const Strong = (props: ComponentPropsWithoutRef<"strong">) => {
	return (
		<strong
			{...props}
			className={`text-[var(--color-text-normal)] [&>li]:ml-2 [&>li]:marker:font-medium ${props.className ?? ""}`}
		/>
	)
}
