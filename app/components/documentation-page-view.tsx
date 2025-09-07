import type { Page } from "content-collections"
import { extractHeadingTreeFromMarkdown } from "~/utils/extract-heading-tree-from-mdx"
import GithubContributeLinks from "./github-contribute-links"
import PageMdxArticle from "./page-mdx-article"
import { PageNavigation, type PageNavigationItem } from "./page-navigation"
import { TableOfContents } from "./table-of-content"

export function DocumentationPageView({
	page,
	previous,
	next,
}: {
	page: Page
	previous: PageNavigationItem | undefined
	next: PageNavigationItem | undefined
}) {
	const toc = extractHeadingTreeFromMarkdown(page.rawMdx)
	return (
		<div className="flex min-h-screen flex-row">
			<div className="mx-auto flex w-full max-w-screen-4xl flex-col gap-4 pt-4 lg:gap-8 xl:pt-0">
				<PageMdxArticle page={page} />
				<PageNavigation previous={previous} next={next} />
			</div>
			<aside className="hidden w-56 min-w-min flex-shrink-0 xl:block">
				<div className="sticky top-37 pb-10">
					<GithubContributeLinks pagePath={page._meta.filePath} />
					<TableOfContents items={toc} />
				</div>
			</aside>
		</div>
	)
}
