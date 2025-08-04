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
		const reconstructedContent = lines.join("\n")
		const finalCode = processCopyContent(reconstructedContent)

		await navigator.clipboard.writeText(finalCode)
		setCopyState("copied")
		setTimeout(() => setCopyState("copy"), 2000)
	}

	const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (copyState !== "copied") {
			e.currentTarget.style.backgroundColor = "var(--color-code-copy-hover-bg)"
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
			className="absolute top-3 right-3 flex items-center gap-1 rounded bg-[var(--color-code-copy-bg)] px-2 py-1 text-[var(--color-code-copy-text)] text-xs opacity-0 transition-all hover:cursor-pointer disabled:cursor-not-allowed group-hover:opacity-100"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{copyState === "copy" ? (
				<>
					<Icon name="ClipboardCopy" className="size-5" />
					{t("buttons.copy")}
				</>
			) : (
				<>
					<Icon name="ClipboardCheck" className="size-5" />
					{t("buttons.copied")}
				</>
			)}
		</button>
	)
}
