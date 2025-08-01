import { createLineData } from "../utils/code-block-parser"
import { type TokenType, getTokenColor, type tokenize } from "../utils/code-block-syntax-highlighter"

interface TokenElementProps {
	token: ReturnType<typeof tokenize>[0]
	index: number
}

const TokenElement = ({ token, index }: TokenElementProps) => (
	<span key={index} style={{ color: getTokenColor(token.type as TokenType) }}>
		{token.value}
	</span>
)

interface DiffIndicatorProps {
	indicator: string
}

const DiffIndicator = ({ indicator }: DiffIndicatorProps) => (
	<span
		className="absolute top-0 left-2 w-4 select-none text-center font-medium"
		style={{ color: "var(--color-diff-indicator)" }}
	>
		{indicator}
	</span>
)

interface LineElementProps {
	line: string
	index: number
}

export const LineElement = ({ line, index }: LineElementProps) => {
	const lineData = createLineData(line)

	return (
		<div key={index} className="relative">
			<div
				className="flex min-h-[1.5rem] items-center pr-4 pl-8"
				style={{
					backgroundColor: lineData.styles.backgroundColor,
					borderLeft: lineData.styles.borderLeft,
					borderLeftColor: lineData.styles.borderLeftColor,
				}}
			>
				{!lineData.isNormalDiff && <DiffIndicator indicator={lineData.styles.indicator} />}
				<span className="block">
					{lineData.tokens.map((token, tokenIndex) => (
						<TokenElement key={`${token.value}-${tokenIndex}`} token={token} index={tokenIndex} />
					))}
				</span>
			</div>
		</div>
	)
}
