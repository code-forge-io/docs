import { allPages } from "content-collections"
import { MDXWrapper } from "~/components/mdx-wrapper"
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
	const sections = getSidebarTree("v1.0.1")
	const { previous, next } = usePreviousNextPages(sections)

	return (
		<div className="flex min-h-screen flex-col">
			{/* TODO use tailwind variables for this because it repeats on 2 places here and layout in main */}
			<div className="mx-auto flex w-full max-w-screen-4xl gap-4 pt-4 lg:gap-8 xl:pt-0">
				<article className="prose prose-invert w-full min-w-0 max-w-4xl flex-grow px-6 pt-6 pb-16 prose-headings:text-[var(--color-text-active)] prose-p:text-[var(--color-text-active)]">
					<header className="mb-10 border-[var(--color-border)] border-b pb-6">
						<h1 className="font-bold text-3xl text-[var(--color-text-heading)]">{page.title}</h1>
						{page.description && <p className="mt-2 text-[var(--color-text-muted)] text-lg">{page.description}</p>}
						<p>Last updated: 2024-02-02 TODO </p>
					</header>

					<MDXWrapper content={page.content} />
					<Pager previous={previous} next={next} />
				</article>

				<TableOfContents items={toc} pagePath={page._meta.filePath} />
			</div>

			{/* <Footer /> */}
		</div>
	)
}
