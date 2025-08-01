import type { ComponentProps } from "react"
import { cn } from "~/utils/css"
import { Icon } from "./icon/icon"
import type { IconName } from "./icon/icons/types"

interface IconButtonProps extends ComponentProps<"button"> {
	icons: {
		name: IconName
		show: boolean
		className?: string
	}[]
}

export const IconButton = ({ icons, className, ...props }: IconButtonProps) => {
	return (
		<button
			type="button"
			className={cn(
				"group relative inline-flex items-center justify-center rounded-full p-2 text-[var(--color-text-active)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border)] focus-visible:ring-offset-2",
				className
			)}
			{...props}
		>
			{icons.map(({ name, show, className }) => (
				<Icon
					key={name}
					name={name}
					className={cn(
						"absolute h-5 w-5 transition-all duration-300",
						show ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0",
						className
					)}
				/>
			))}
		</button>
	)
}
