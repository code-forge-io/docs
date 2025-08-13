import { allPages } from "content-collections"
import { MDXWrapper } from "~/components/mdx-wrapper"
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
		<div className="flex min-h-screen flex-col">
			<div className="mx-auto flex w-full max-w-screen-4xl gap-4 pt-4 lg:gap-8 xl:pt-0">
				<article className="prose prose-invert w-full min-w-0 max-w-4xl flex-grow px-6 pt-6 pb-16 prose-headings:text-[var(--color-text-active)] prose-p:text-[var(--color-text-active)]">
					<header className="mb-10 border-[var(--color-border)] border-b pb-6">
						<h1 className="font-bold text-3xl text-[var(--color-text-heading)]">{page.title}</h1>
					</header>
					<MDXWrapper content={page.content} />
				</article>
			</div>
		</div>
	)
}
