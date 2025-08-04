import { ArrowRight, ExternalLink, FileText, Folder, Hash } from "lucide-react"
import { cn } from "~/utils/css"
import type { SearchItem } from "../search-types"

interface SearchResultProps {
	item: SearchItem
	highlightedText: string
	isSelected: boolean
	onClick: () => void
}

// Icon mapping for different content types
const RESULT_ICONS = {
	heading: Hash,
	section: Folder,
	page: FileText,
} as const

// Type label mapping
const TYPE_LABELS = {
	heading: "Heading",
	section: "Section",
	page: "Page",
} as const

// Type-specific styling
const TYPE_STYLES = {
	heading: "bg-[var(--color-badge-heading)] text-[var(--color-badge-heading-text)]",
	section: "bg-[var(--color-badge-section)] text-[var(--color-badge-section-text)]",
	page: "bg-[var(--color-badge-page)] text-[var(--color-badge-page-text)]",
} as const

// Result icon component
const ResultIcon = ({
	type,
	isSelected,
}: {
	type: keyof typeof RESULT_ICONS
	isSelected: boolean
}) => {
	const IconComponent = RESULT_ICONS[type] || RESULT_ICONS.page

	return (
		<div
			className={cn(
				"mt-0.5 transition-colors duration-150",
				isSelected ? "text-[var(--color-result-icon-selected)]" : "text-[var(--color-result-icon)]"
			)}
		>
			<IconComponent className="h-4 w-4" />
		</div>
	)
}

// Breadcrumb component
const Breadcrumb = ({ item }: { item: SearchItem }) => {
	const parts: string[] = []

	if (item.category) parts.push(item.category)
	if (item.section) parts.push(item.section)
	if (item.breadcrumb) parts.push(...item.breadcrumb)

	const breadcrumbText = parts.join(" › ")

	if (!breadcrumbText) return null

	return (
		<span
			className={cn(
				"rounded-full bg-[var(--color-breadcrumb-bg)] px-2 py-0.5 text-xs",
				"text-[var(--color-breadcrumb-text)]"
			)}
		>
			{breadcrumbText}
		</span>
	)
}

// Type badge component
const TypeBadge = ({ type }: { type: keyof typeof TYPE_LABELS }) => {
	const label = TYPE_LABELS[type] || TYPE_LABELS.page
	const styling = TYPE_STYLES[type] || TYPE_STYLES.page

	return <span className={cn("rounded-full px-2 py-0.5 font-medium text-xs", styling)}>{label}</span>
}

// Result title component
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
		{/* biome-ignore lint/security/noDangerouslySetInnerHtml: 	TODO */}
		<span dangerouslySetInnerHTML={{ __html: highlightedText || title }} />
	</div>
)

// Metadata section component
const ResultMetadata = ({ item }: { item: SearchItem }) => (
	<div className="mt-2 flex items-center gap-2">
		<Breadcrumb item={item} />
		<TypeBadge type={item.type as keyof typeof TYPE_LABELS} />
	</div>
)

// Arrow indicator component
const ArrowIndicator = ({
	slug,
	isSelected,
}: {
	slug: string
	isSelected: boolean
}) => {
	const isExternal = slug.startsWith("http")
	const IconComponent = isExternal ? ExternalLink : ArrowRight

	return (
		<div
			className={cn(
				"mt-0.5 transition-all duration-150",
				isSelected
					? "translate-x-0 text-[var(--color-result-icon-selected)] opacity-100"
					: "-translate-x-1 text-[var(--color-result-arrow)] opacity-0"
			)}
		>
			<IconComponent className="h-4 w-4" />
		</div>
	)
}

// Main content area component
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

// Custom hook for button styling
const useButtonStyles = (isSelected: boolean) => {
	return cn(
		"flex w-full items-start gap-3 border-r-2 px-4 py-3 text-left transition-all duration-150",
		"hover:bg-[var(--color-result-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-trigger-focus-ring)]",
		isSelected
			? "border-[var(--color-result-selected-border)] bg-[var(--color-result-selected)] shadow-sm"
			: "border-transparent"
	)
}

// Main SearchResult component
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
