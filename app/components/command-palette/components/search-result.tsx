import { BreadcrumbItem, Breadcrumbs } from "~/ui/breadcrumbs"
import { Icon, pickIcon } from "~/ui/icon/icon"
import { cn } from "~/utils/css"
import type { SearchItem } from "../search-types"

interface SearchResultProps {
	item: SearchItem
	highlightedText: string
	isSelected: boolean
	onClick: () => void
}

const RESULT_ICONS = {
	heading: pickIcon("Hash"),
	section: pickIcon("Folder"),
	page: pickIcon("FileText"),
} as const

const TYPE_LABELS = {
	heading: "Heading",
	section: "Section",
	page: "Page",
} as const

const TYPE_STYLES = {
	heading: "bg-[var(--color-badge-heading)] text-[var(--color-badge-heading-text)]",
	section: "bg-[var(--color-badge-section)] text-[var(--color-badge-section-text)]",
	page: "bg-[var(--color-badge-page)] text-[var(--color-badge-page-text)]",
} as const

const ResultIcon = ({
	type,
	isSelected,
}: {
	type: keyof typeof RESULT_ICONS
	isSelected: boolean
}) => {
	const icon = RESULT_ICONS[type] || RESULT_ICONS.page

	return (
		<div
			className={cn(
				"mt-0.5 transition-colors duration-150",
				isSelected ? "text-[var(--color-result-icon-selected)]" : "text-[var(--color-result-icon)]"
			)}
		>
			<Icon name={icon} className="size-4" />
		</div>
	)
}

const TypeBadge = ({ type }: { type: keyof typeof TYPE_LABELS }) => {
	const label = TYPE_LABELS[type] || TYPE_LABELS.page
	const styling = TYPE_STYLES[type] || TYPE_STYLES.page

	return <span className={cn("rounded-full px-2 py-0.5 font-medium text-xs", styling)}>{label}</span>
}

const ResultTitle = ({
	title,
	highlightedText,
	isSelected,
}: {
	title: string
	highlightedText: string
	isSelected: boolean
}) => (
	<div
		className={cn(
			"font-medium leading-snug transition-colors duration-150",
			isSelected ? "text-[var(--color-result-selected-text)]" : "text-[var(--color-result-text)]"
		)}
	>
		{/* biome-ignore lint/security/noDangerouslySetInnerHtml: rendering text */}
		<span dangerouslySetInnerHTML={{ __html: highlightedText || title }} />
	</div>
)

const ResultMetadata = ({ item }: { item: SearchItem }) => (
	<div className="mt-2 flex items-center gap-2">
		<Breadcrumbs>
			{item.breadcrumb?.map((item) => (
				<BreadcrumbItem key={item} className="text-[var(--color-breadcrumb-text)] text-xs">
					{item}
				</BreadcrumbItem>
			))}
		</Breadcrumbs>
		<TypeBadge type={item.type as keyof typeof TYPE_LABELS} />
	</div>
)

const ArrowIndicator = ({
	slug,
	isSelected,
}: {
	slug: string
	isSelected: boolean
}) => {
	const isExternal = slug.startsWith("http")

	return (
		<div
			className={cn(
				"mt-0.5 transition-all duration-150",
				isSelected
					? "translate-x-0 text-[var(--color-result-icon-selected)] opacity-100"
					: "-translate-x-1 text-[var(--color-result-arrow)] opacity-0"
			)}
		>
			{isExternal ? <Icon name="ExternalLink" className="size-4" /> : <Icon name="ArrowRight" className="size-4" />}
		</div>
	)
}

const ResultContent = ({
	item,
	highlightedText,
	isSelected,
}: {
	item: SearchItem
	highlightedText: string
	isSelected: boolean
}) => (
	<div className="min-w-0 flex-1">
		<ResultTitle title={item.title} highlightedText={highlightedText} isSelected={isSelected} />
		<ResultMetadata item={item} />
	</div>
)

const useButtonStyles = (isSelected: boolean) => {
	return cn(
		"flex w-full items-start gap-3 border-r-2 px-4 py-3 text-left transition-all duration-150",
		"hover:bg-[var(--color-result-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-trigger-focus-ring)]",
		isSelected
			? "border-[var(--color-result-selected-border)] bg-[var(--color-result-selected)] shadow-sm"
			: "border-transparent"
	)
}

export const SearchResult = ({ item, highlightedText, isSelected, onClick }: SearchResultProps) => {
	const buttonStyles = useButtonStyles(isSelected)

	return (
		<button type="button" onClick={onClick} className={buttonStyles}>
			<ResultIcon type={item.type as keyof typeof RESULT_ICONS} isSelected={isSelected} />
			<ResultContent item={item} highlightedText={highlightedText} isSelected={isSelected} />
			<ArrowIndicator slug={item.slug} isSelected={isSelected} />
		</button>
	)
}
