import type React from "react"
import type { ReactNode } from "react"
import { Icon } from "./icon/icon"

interface AlertProps {
	children: ReactNode
	title?: string
	variant: "info" | "warning"
	className?: string
}

const Alert: React.FC<AlertProps> = ({ children, title, variant, className = "" }) => {
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
				return <Icon name="Info" className="h-6 w-6" />
			case "warning":
				return <Icon name="TriangleAlert" className="h-6 w-6" />
			default:
				return null
		}
	}

	const styles = getVariantStyles()
	// TODO use i18next
	const defaultTitle = variant === "info" ? "Good to know" : "Warning"

	return (
		<div
			className={`my-6 flex items-start gap-4 rounded-xl border p-6 transition-all duration-300 ${styles.container} ${className}`}
		>
			<div className={`mt-0.5 flex-shrink-0 ${styles.icon}`}>{getIcon()}</div>

			<div className="min-w-0 flex-1">
				<h3 className={`mb-2 font-semibold text-lg ${styles.title}`}>{title || defaultTitle}</h3>

				<div className={`prose prose-sm max-w-none ${styles.content}`}>{children}</div>
			</div>
		</div>
	)
}

export default Alert
