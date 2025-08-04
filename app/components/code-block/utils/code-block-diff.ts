type DiffType = "added" | "removed" | "normal"

const DIFF_PATTERNS = {
	"+ ": "added",
	"- ": "removed",
} as const

type DiffPatternPrefix = keyof typeof DIFF_PATTERNS

type DiffStyle = {
	backgroundColor: string
	borderLeft: string
	borderLeftColor: string
	indicator: string
}

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
} as const satisfies Record<DiffType, DiffStyle>

export const getDiffType = (line: string) => {
	const trimmed = line.trimStart()
	const prefix = trimmed.slice(0, 2)

	return isDiffPatternPrefix(prefix) ? DIFF_PATTERNS[prefix] : "normal"
}

const isDiffPatternPrefix = (value: string): value is DiffPatternPrefix =>
	Object.prototype.hasOwnProperty.call(DIFF_PATTERNS, value)

export const cleanDiffLine = (line: string) => line.replace(/^(\s*)[+-] /, "$1")

export const getDiffStyles = (diffType: DiffType) => DIFF_STYLES[diffType]
