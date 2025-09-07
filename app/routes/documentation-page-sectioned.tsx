import { DocumentationPageView } from "~/components/documentation-page-view"
import { useDocumentationLayoutLoaderData } from "~/hooks/use-documentation-layout-loader-data"
import { usePreviousNextPages } from "~/hooks/use-previous-next-pages"
import { getDomain } from "~/utils/get-domain"
import { loadContentCollections } from "~/utils/load-content-collections"
import { generateMetaFields } from "~/utils/seo"
import { splitSlug } from "~/utils/split-slug"
import { normalizeVersion } from "~/utils/version-resolvers"
import type { Route } from "./+types/documentation-page-sectioned"

export const meta = ({ data }: Route.MetaArgs) => {
	const { page, domain, version } = data
	const { section, subsection, filename } = splitSlug(page.slug)
	const path = [version, section, subsection, filename].filter(Boolean).join("/")
	return generateMetaFields({
		domain,
		path: `/${path}`,
		// change "Package Name" to your package name
		title: `${page.title} · Package Name`,
		description: page.description,
	})
}

export async function loader({ params, request }: Route.LoaderArgs) {
	const { version: v, section, subsection, filename } = params
	if (!section || !filename) throw new Response("Not Found", { status: 404 })

	const { version } = normalizeVersion(v)
	const slug = [section, subsection, filename].filter(Boolean).join("/")

	const { allPages } = await loadContentCollections(version)
	const page = allPages.find((p) => p.slug === slug)
	if (!page) throw new Response("Not Found", { status: 404 })

	const { domain } = getDomain(request)
	return { page, version, domain }
}

export default function DocumentationPage({ loaderData }: Route.ComponentProps) {
	const { page } = loaderData
	const {
		sidebarTree: { sections, documentationPages },
	} = useDocumentationLayoutLoaderData()
	const { previous, next } = usePreviousNextPages(sections, documentationPages)

	return <DocumentationPageView page={page} previous={previous} next={next} />
}
