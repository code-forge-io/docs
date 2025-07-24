export type DiffType = "added" | "removed" | "normal"

const DIFF_PATTERNS: Record<string, DiffType> = {
	"+ ": "added",
	"- ": "removed",
}

const DIFF_STYLES: Record<
	DiffType,
	{
		backgroundColor: string
		borderLeft: string
		borderLeftColor: string
		indicator: string
	}
> = {
	added: {
		backgroundColor: "var(--color-diff-added-bg)",
		borderLeft: "2px solid",
		borderLeftColor: "var(--color-diff-added-border)",
		indicator: "+",
	},
	removed: {
		backgroundColor: "var(--color-diff-removed-bg)",
		borderLeft: "2px solid",
		borderLeftColor: "var(--color-diff-removed-border)",
		indicator: "-",
	},
	normal: {
		backgroundColor: "transparent",
		borderLeft: "none",
		borderLeftColor: "transparent",
		indicator: "",
	},
}

export const getDiffType = (line: string) => {
	const trimmed = line.trimStart()
	const pattern = Object.keys(DIFF_PATTERNS).find((p) => trimmed.startsWith(p))
	return pattern ? DIFF_PATTERNS[pattern] : "normal"
}

export const cleanDiffLine = (line: string) => line.replace(/^(\s*)[+-] /, "$1")

export const getDiffStyles = (diffType: DiffType) => DIFF_STYLES[diffType]
