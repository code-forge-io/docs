import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Icon } from "~/ui/icon/icon"

interface CopyButtonProps {
	codeContent: string
}

export const CopyButton = ({ codeContent }: CopyButtonProps) => {
	const [copyState, setCopyState] = useState<"copy" | "copied">("copy")
	const { t } = useTranslation()
	const handleCopy = async () => {
		const finalCode = codeContent
			.split("\n")
			.filter((line) => !line.trimStart().startsWith("- "))
			.map((line) => line.replace(/^(\s*)\+ /, "$1"))
			.join("\n")
		await navigator.clipboard.writeText(finalCode)
		setCopyState("copied")
		setTimeout(() => setCopyState("copy"), 3000)
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			disabled={copyState === "copied"}
			className="absolute top-3 right-3 flex items-center gap-1 rounded px-2 py-1 text-xs opacity-0 transition-all disabled:cursor-not-allowed group-hover:opacity-100"
			onMouseEnter={(e) => {
				if (copyState !== "copied") {
					e.currentTarget.style.backgroundColor = "var(--color-code-copy-hover-bg)"
				}
			}}
			onMouseLeave={(e) => {
				if (copyState !== "copied") {
					e.currentTarget.style.backgroundColor = "var(--color-code-copy-bg)"
				}
			}}
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
