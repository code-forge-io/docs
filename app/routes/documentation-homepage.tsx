import { allPages } from "content-collections"
import GithubContributeLinks from "~/components/github-contribute-links"
import PageMdxArticle from "~/components/page-mdx-article"
import type { Route } from "./+types/documentation-homepage"

export async function loader() {
	const page = allPages.find((post) => post._meta.path === "_index")
	if (!page) {
		throw new Response("Not Found", { status: 404 })
	}
	return { page }
}

export default function DocumentationHomepage({ loaderData }: Route.ComponentProps) {
	const { page } = loaderData
	return (
		<div className="flex min-h-screen flex-row">
			<div className="mx-auto flex w-full max-w-screen-4xl gap-4 pt-4 lg:gap-8 xl:pt-0">
				<PageMdxArticle page={page} />
			</div>
			<div className="hidden w-56 min-w-min flex-shrink-0 2xl:block">
				<div className="sticky top-37 pb-10">
					<GithubContributeLinks pagePath={page._meta.filePath} />
				</div>
			</div>
		</div>
	)
}
