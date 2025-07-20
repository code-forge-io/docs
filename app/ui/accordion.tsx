import { type ReactNode, useState } from "react"
import { cn } from "../utils/css"
import { Icon } from "./icon/icon"
import { Title, type ValidTitleElements } from "./title"

interface AccordionItemProps {
	title?: string
	titleElement?: keyof typeof ValidTitleElements
	titleClassName?: string
	content: ReactNode
	defaultOpen?: boolean
}

interface AccordionProps {
	children: ReactNode
	className?: string
}

const AccordionContent = ({ isOpen, children }: { isOpen: boolean; children: ReactNode }) => {
	return (
		<div
			className={cn(
				"grid overflow-hidden transition-all duration-300 ease-in-out",
				isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
			)}
		>
			<div className="overflow-hidden p-2">{children}</div>
		</div>
	)
}

export const AccordionItem = ({
	title,
	titleElement,
	titleClassName,
	content,
	defaultOpen = false,
}: AccordionItemProps) => {
	const [isOpen, setIsOpen] = useState(defaultOpen)

	const buttonClasses =
		"flex justify-between items-center w-full p-2 transition-all duration-200 text-[var(--color-text-normal)] hover:text-[var(--color-text-hover)] hover:bg-[var(--color-background-hover)] rounded-md"

	const iconClasses = "w-4 h-4 transition-transform duration-300"

	return (
		<div>
			<button type="button" className={buttonClasses} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
				<Title as={titleElement ?? "h6"} className={titleClassName}>
					{title}
				</Title>
				<Icon name="ChevronDown" className={cn(iconClasses, isOpen && "rotate-180")} />
			</button>
			<AccordionContent isOpen={isOpen}>{content}</AccordionContent>
		</div>
	)
}

export const Accordion = ({ children, className }: AccordionProps) => {
	return <div className={cn("py-2", className)}>{children}</div>
}
