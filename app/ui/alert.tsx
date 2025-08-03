import type { ReactNode } from "react"
import { Icon } from "./icon/icon"

interface AlertProps {
	children: ReactNode
	title?: string
	variant: "info" | "warning"
	className?: string
}

export const Alert = ({ children, title, variant, className = "" }: AlertProps) => {
	const getVariantStyles = () => {
		switch (variant) {
			case "info":
				return {
					container: "bg-[var(--color-info-bg)] border-[var(--color-info-border)]",
					title: "text-[var(--color-info-text)]",
					content: "text-[var(--color-info-text)]",
					icon: "text-[var(--color-info-icon)]",
				}
			case "warning":
				return {
					container: "bg-[var(--color-warning-bg)] border-[var(--color-warning-border)]",
					title: "text-[var(--color-warning-text)]",
					content: "text-[var(--color-warning-text)]",
					icon: "text-[var(--color-warning-icon)]",
				}
			default:
				return {
					container: "",
					title: "",
					content: "",
					icon: "",
				}
		}
	}

	const getIcon = () => {
		switch (variant) {
			case "info":
				return <Icon name="Info" className="h-5 w-5" />
			case "warning":
				return <Icon name="TriangleAlert" className="h-5 w-5" />
			default:
				return null
		}
	}

	const styles = getVariantStyles()
	const defaultTitle = variant === "info" ? "Good to know" : "Warning"

	return (
		<div
			className={`my-6 flex flex-col gap-2 rounded-xl border p-6 transition-all duration-300 ${styles.container} ${className}`}
		>
			<div className="flex items-center gap-2">
				<div className={styles.icon}>{getIcon()}</div>
				<h3 className={` font-semibold text-lg ${styles.title}`}>{title || defaultTitle}</h3>
			</div>

			<div className={`prose prose-sm max-w-none ${styles.content}`}>{children}</div>
		</div>
	)
}
