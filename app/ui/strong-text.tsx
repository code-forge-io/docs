import type { ComponentPropsWithoutRef } from "react"

export const Strong = (props: ComponentPropsWithoutRef<"strong">) => {
	return <strong {...props} className={`text-[var(--color-text-normal)] ${props.className ?? ""}`} />
}
