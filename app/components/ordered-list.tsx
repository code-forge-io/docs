import type { ComponentPropsWithoutRef } from "react"

export const OrderedList = (props: ComponentPropsWithoutRef<"ol">) => {
	return (
		<ol
			{...props}
			className={`list-decimal space-y-1 pl-6 text-[var(--color-text-normal)] [&>li]:ml-2 [&>li]:marker:font-medium ${props.className ?? ""}`}
		/>
	)
}
