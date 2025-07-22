import type { ReactNode } from "react"
import Alert from "./alert"

interface InfoAlertProps {
	children: ReactNode
	title?: string
	className?: string
}

const InfoAlert = ({ children, title, className }: InfoAlertProps) => {
	return (
		<Alert variant="info" title={title} className={className}>
			{children}
		</Alert>
	)
}

export default InfoAlert
