import { MDXContent } from "@content-collections/mdx/react"
import InfoAlert from "~/ui/info-alert"
import WarningAlert from "~/ui/warning-alert"
import { Anchor } from "./anchor-tag"
import { CodeBlock } from "./code-block"
import { InlineCode } from "./inline-code"
import { ListItem } from "./list-item"
import { OrderedList } from "./ordered-list"
import { Strong } from "./strong-text"

export const MDXWrapper = ({ content }: { content: string }) => (
	<MDXContent
		code={content}
		components={{
			code: InlineCode,
			pre: CodeBlock,
			ol: OrderedList,
			li: ListItem,
			strong: Strong,
			a: Anchor,
			InfoAlert,
			WarningAlert,
			// you can add any custom component here or override existing ones following the MDX documentation: https://mdxjs.com/table-of-components/#components
		}}
	/>
)
