import GithubContributeLinks from "~/components/github-contribute-links"
import PageMdxArticle from "~/components/page-mdx-article"
import { PageNavigation } from "~/components/page-navigation"
import { TableOfContents } from "~/components/table-of-content"
import { useDocumentationLayoutLoaderData } from "~/hooks/use-documentation-layout-loader-data"
import { usePreviousNextPages } from "~/hooks/use-previous-next-pages"
import { extractHeadingTreeFromMarkdown } from "~/utils/extract-heading-tree-from-mdx"
import { loadContentCollections } from "~/utils/load-content-collections"
import { resolveDocVersionOrRedirect } from "~/utils/version-links"
import type { Route } from "./+types/documentation-page"

export async function loader({ params }: Route.LoaderArgs) {
	const { version: v, section, subsection, filename } = params
	if (!section || !filename) throw new Response("Not Found", { status: 404 })

	const { version } = resolveDocVersionOrRedirect({ versionParam: v, section, subsection, filename })

	const slug = subsection ? `${section}/${subsection}/${filename}` : `${section}/${filename}`
	const { allPages } = await loadContentCollections(version)
	const page = allPages.find((p) => p.slug === slug)
	if (!page) throw new Response("Not Found", { status: 404 })

	return { page, version }
}

export type Page = Awaited<ReturnType<typeof loader>>["page"]

export default function DocumentationPage({ loaderData }: Route.ComponentProps) {
	const { page } = loaderData
	const { sidebarTree } = useDocumentationLayoutLoaderData()
	const { previous, next } = usePreviousNextPages(sidebarTree)
	const toc = extractHeadingTreeFromMarkdown(page.rawMdx)

	return (
		<div className="flex min-h-screen flex-row">
			<div className="mx-auto flex w-full max-w-screen-4xl flex-col gap-4 pt-4 lg:gap-8 xl:pt-0">
				<PageMdxArticle page={page} />
				<PageNavigation previous={previous} next={next} />
			</div>
			<div className="hidden w-56 min-w-min flex-shrink-0 xl:block">
				<div className="sticky top-37 pb-10">
					<GithubContributeLinks pagePath={page._meta.filePath} />
					<TableOfContents items={toc} />
				</div>
			</div>
		</div>
	)
}
