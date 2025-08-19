import { BreadcrumbItem, Breadcrumbs } from "~/ui/breadcrumbs"
import { Icon } from "~/ui/icon/icon"
import { cn } from "~/utils/css"
import { useMobileSidebar } from "./mobile-sidebar-context"
import type { SidebarSection } from "./sidebar"
import { SidebarContent } from "./sidebar-content"

const MobileSidebarMenuButton = () => {
	const { open } = useMobileSidebar()

	return (
		<button
			type="button"
			onClick={open}
			className="px-3 py-2 text-[var(--color-text-normal)] transition-colors duration-200 hover:text-[var(--color-text-hover)]"
			aria-label="Open navigation menu"
		>
			<Icon name="Menu" className="size-5" />
		</button>
	)
}

export const MobileSidebarHeader = ({ breadcrumbs }: { breadcrumbs: string[] }) => {
	return (
		<div className="fixed z-40 flex h-fit w-full items-center gap-3 border-[var(--color-border)] border-b-2 bg-[var(--color-background)] px-4 py-3 ">
			<MobileSidebarMenuButton />
			<Breadcrumbs className="text-sm">
				{breadcrumbs.map((item) => (
					<BreadcrumbItem key={item}>{item}</BreadcrumbItem>
				))}
			</Breadcrumbs>
		</div>
	)
}

export const MobileSidebarOverlay = () => {
	const { isOpen, close } = useMobileSidebar()

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: We don't need keyboard support for this overlay
		<div
			className={`fixed inset-0 z-40 bg-black transition-opacity duration-500 ${
				isOpen ? "opacity-50" : "pointer-events-none opacity-0"
			}`}
			onClick={close}
			aria-hidden="true"
		/>
	)
}

const MobileSidebarCloseButton = () => {
	const { close } = useMobileSidebar()

	return (
		<button
			type="button"
			onClick={close}
			className="absolute top-1 right-1 z-10 rounded-full p-2 text-[var(--color-text-normal)] transition-colors duration-200 hover:text-[var(--color-text-hover)]"
			aria-label="Close navigation menu"
		>
			<Icon name="X" className="size-5" />
		</button>
	)
}

export const MobileSidebarPanel = ({
	items,
	className,
}: {
	items: SidebarSection[]
	className: string
}) => {
	const { close, isOpen } = useMobileSidebar()
	return (
		<div
			className={cn(
				"fixed left-0 z-50 flex h-[calc(100vh-var(--header-height))] w-80 flex-col overflow-hidden bg-[var(--color-background)] p-4 transition-transform duration-500 ease-in-out",
				isOpen ? "translate-x-0" : "-translate-x-full",
				className
			)}
			aria-modal="true"
			aria-label="Navigation menu"
		>
			<SidebarContent items={items} onClose={close} />
			<MobileSidebarCloseButton />
		</div>
	)
}
