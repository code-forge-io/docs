import { MDXContent } from "@content-collections/mdx/react"
import { allPages } from "content-collections"
import type { Route } from "./+types/documentation-page"

export async function loader({ params }: Route.LoaderArgs) {
	const post = allPages.find((post) => post.slug === `${params.version}/${params.section}/${params.filename}`)
	if (!post) {
		throw new Response("Not Found", { status: 404 })
	}
	return { post }
}

export default function Post({ loaderData }: Route.ComponentProps) {
	const post = loaderData.post

	return (
		<article className="prose prose-slate max-w-none px-4 pt-8 pb-16 md:px-8">
			<header className="mb-10 border-[var(--color-border)] border-b pb-6">
				<h1 className="font-bold text-3xl text-[var(--color-text-heading)]">{post.title}</h1>
				{post.description && <p className="mt-2 text-[var(--color-text-muted)] text-lg">{post.description}</p>}
			</header>

			<MDXContent code={post.content} />
		</article>
	)
}
