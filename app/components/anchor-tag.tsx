import type { ComponentPropsWithoutRef } from "react"

export const Anchor = (props: ComponentPropsWithoutRef<"a">) => {
	return (
		<a
			{...props}
			className={`text-[var(--color-text-normal)] [&>li]:ml-2 [&>li]:marker:font-medium ${props.className ?? ""}`}
		/>
	)
}
