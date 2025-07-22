import type { ReactNode } from "react"
import Alert from "./alert"

interface WarningAlertProps {
	children: ReactNode
	title?: string
	className?: string
}

const WarningAlert = ({ children, title, className }: WarningAlertProps) => {
	return (
		<Alert variant="warning" title={title} className={className}>
			{children}
		</Alert>
	)
}

export default WarningAlert
