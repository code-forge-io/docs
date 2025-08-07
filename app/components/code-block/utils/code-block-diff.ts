const DIFF_STYLES = {
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
} as const

type DiffType = keyof typeof DIFF_STYLES

const DIFF_PATTERNS = {
	"+ ": "added",
	"- ": "removed",
} as const

type DiffPatternPrefix = keyof typeof DIFF_PATTERNS

export const getDiffType = (line: string): DiffType => {
	const prefix = line.trimStart().slice(0, 2)
	return DIFF_PATTERNS[prefix as DiffPatternPrefix] ?? "normal"
}

export const cleanDiffLine = (line: string) => line.replace(/^(\s*)[+-] /, "$1")

export const getDiffStyles = (diffType: DiffType) => DIFF_STYLES[diffType]
