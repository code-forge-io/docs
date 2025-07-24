export type TokenType = "keyword" | "string" | "number" | "comment" | "operator" | "punctuation" | "function" | "text"

const MASTER_REGEX =
	/(\s+|\/\/.*?(?=\n|$)|\/\*[\s\S]*?\*\/|(['"`])(?:(?!\2)[^\\]|\\.)*\2|\d+\.?\d*|[a-zA-Z_$][a-zA-Z0-9_$]*|===|!==|<=|>=|==|!=|&&|\|\||[+\-*/%=<>!?:(){}[\];,.]|\+\+|--|[+\-*/%]=|=>)/g

const KEYWORDS = [
	"import",
	"export",
	"default",
	"from",
	"const",
	"let",
	"var",
	"function",
	"return",
	"if",
	"else",
	"for",
	"while",
	"do",
	"switch",
	"case",
	"break",
	"continue",
	"try",
	"catch",
	"finally",
	"throw",
	"new",
	"class",
	"extends",
	"interface",
	"type",
	"public",
	"private",
	"protected",
	"static",
	"async",
	"await",
	"true",
	"false",
	"null",
	"undefined",
	"typeof",
	"instanceof",
]

const OPERATORS = [
	"+",
	"-",
	"*",
	"/",
	"=",
	"==",
	"===",
	"!=",
	"!==",
	"<",
	">",
	"<=",
	">=",
	"&&",
	"||",
	"!",
	"?",
	":",
	"++",
	"--",
	"+=",
	"-=",
	"*=",
	"/=",
	"=>",
]

const isKeyword = (value: string) => KEYWORDS.includes(value)
const isOperator = (value: string) => OPERATORS.includes(value)
const isFunction = (value: string) => /^[A-Z]/.test(value)
const isWhitespace = (value: string) => /^\s/.test(value)
const isComment = (value: string) => value.startsWith("//") || value.startsWith("/*")
const isString = (value: string) => /^['"`]/.test(value)
const isNumber = (value: string) => /^\d/.test(value)
const isIdentifier = (value: string) => /^[a-zA-Z_$]/.test(value)

const classifyIdentifier = (value: string) => {
	return isKeyword(value) ? "keyword" : isFunction(value) ? "function" : "text"
}

const classifyToken = (value: string) => {
	switch (true) {
		case isWhitespace(value):
			return "text"
		case isComment(value):
			return "comment"
		case isString(value):
			return "string"
		case isNumber(value):
			return "number"
		case isIdentifier(value):
			return classifyIdentifier(value)
		case isOperator(value):
			return "operator"
		default:
			return "punctuation"
	}
}

export const tokenize = (code: string) =>
	Array.from(code.matchAll(MASTER_REGEX), (match) => ({
		type: classifyToken(match[0]),
		value: match[0],
	}))

const TOKEN_COLORS = {
	keyword: "var(--color-code-keyword)",
	string: "var(--color-code-string)",
	number: "var(--color-code-number)",
	comment: "var(--color-code-comment)",
	operator: "var(--color-code-operator)",
	punctuation: "var(--color-code-punctuation)",
	function: "var(--color-code-function)",
	text: "var(--color-code-block-text)",
}

export const getTokenColor = (type: TokenType) => TOKEN_COLORS[type]
