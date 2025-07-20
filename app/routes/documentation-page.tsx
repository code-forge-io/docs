import { MDXContent } from "@content-collections/mdx/react"
import { allPages } from "content-collections"
import { CodeBlock } from "~/components/code-block"
import { InlineCode } from "~/components/inline-code"
import { OrderedList } from "~/components/ordered-list"
import { Pager } from "~/components/pager"
import { TableOfContents } from "~/components/table-of-content"
import { usePreviousNextPages } from "~/hooks/use-previous-next-pages"
import { getSidebarTree } from "~/utils/create-sidebar-tree"
import { extractHeadingTreeFromMarkdown } from "~/utils/table-of-content"
import type { Route } from "./+types/documentation-page"

export async function loader({ params }: Route.LoaderArgs) {
	const { version, section, subsection, filename } = params
	const slug = subsection ? `${version}/${section}/${subsection}/${filename}` : `${version}/${section}/${filename}`
	const page = allPages.find((post) => post.slug === slug)
	if (!page) {
		throw new Response("Not Found", { status: 404 })
	}
	return { page }
}

export default function DocumentationPage({ loaderData }: Route.ComponentProps) {
	const { page } = loaderData
	const toc = extractHeadingTreeFromMarkdown(page.rawMdx)
	//TODO get sections from the loader
	const sections = getSidebarTree("v1.0.1")
	const { previous, next } = usePreviousNextPages(sections)
	return (
		<div className="mx-auto flex max-w-7xl gap-8 px-4">
			<article className="prose prose-invert max-w-none flex-grow pt-8 pb-16 prose-headings:text-[var(--color-text-active)] prose-p:text-[var(--color-text-active)] md:px-8">
				<header className="mb-10 border-[var(--color-border)] border-b pb-6">
					<h1 className="font-bold text-3xl text-[var(--color-text-heading)]">{page.title}</h1>
					{page.description && <p className="mt-2 text-[var(--color-text-muted)] text-lg">{page.description}</p>}
				</header>

				<MDXContent
					code={page.content}
					components={{
						code: InlineCode,
						pre: CodeBlock,
						ol: OrderedList,
						// Add any other customized component, following the docs for available components in mdx at the: https://mdxjs.com/table-of-components/#components
					}}
				/>
				<Pager previous={previous} next={next} />
			</article>

			<aside className="hidden w-64 flex-shrink-0 lg:block">
				<div className="pt-8">
					<TableOfContents items={toc} />
				</div>
			</aside>
		</div>
	)
}
