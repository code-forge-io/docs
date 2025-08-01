import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Icon } from "~/ui/icon/icon"
import { processCopyContent } from "../utils/code-block-parser"

interface CopyButtonProps {
	lines: string[]
}

export const CopyButton = ({ lines }: CopyButtonProps) => {
	const [copyState, setCopyState] = useState<"copy" | "copied">("copy")
	const { t } = useTranslation()

	const handleCopy = async () => {
		// Reconstruct content from lines and process for copy
		const reconstructedContent = lines.join("\n")
		const finalCode = processCopyContent(reconstructedContent)

		await navigator.clipboard.writeText(finalCode)
		setCopyState("copied")
		setTimeout(() => setCopyState("copy"), 3000)
	}

	const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (copyState !== "copied") {
			e.currentTarget.style.backgroundColor = "var(--color-code-copy-bg)"
		}
	}

	const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (copyState !== "copied") {
			e.currentTarget.style.backgroundColor = "transparent"
		}
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			disabled={copyState === "copied"}
			className="absolute top-3 right-3 flex items-center gap-1 rounded px-2 py-1 text-[var(--color-code-copy-text)] text-xs opacity-0 transition-all hover:cursor-pointer disabled:cursor-not-allowed group-hover:opacity-100"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{copyState === "copy" ? (
				<>
					<Icon name="ClipboardCopy" width={14} height={14} />
					{t("buttons.copy")}
				</>
			) : (
				<>
					<Icon name="ClipboardCheck" width={14} height={14} />
					{t("buttons.copied")}
				</>
			)}
		</button>
	)
}
