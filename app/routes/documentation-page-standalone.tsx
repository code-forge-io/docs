import { DocumentationPageView } from "~/components/documentation-page-view"
import { useDocumentationLayoutLoaderData } from "~/hooks/use-documentation-layout-loader-data"
import { usePreviousNextPages } from "~/hooks/use-previous-next-pages"
import { getDomain } from "~/utils/get-domain"
import { loadContentCollections } from "~/utils/load-content-collections"
import { generateMetaFields } from "~/utils/seo"
import { normalizeVersion } from "~/utils/version-resolvers"
import type { Route } from "./+types/documentation-page-standalone"

export const meta = ({ data }: Route.MetaArgs) => {
	const { page, domain, version } = data
	// standalone path: /:version?/:filename
	//TODO helper function
	const filename = page.slug.split("/").filter(Boolean).at(-1) ?? page.slug
	const path = [version, filename].filter(Boolean).join("/")
	return generateMetaFields({
		domain,
		path: `/${path}`,
		// change "Package Name" to your package name
		title: `${page.title} · Package Name`,
		description: page.description,
	})
}

export async function loader({ params, request }: Route.LoaderArgs) {
	const { version: v, filename } = params
	if (!filename) throw new Response("Not Found", { status: 404 })

	const { version } = normalizeVersion(v)

	// For standalone, slug IS the filename (no section/subsection)
	const slug = filename

	const { allPages } = await loadContentCollections(version)
	const page = allPages.find((p) => p.slug === slug)
	if (!page) throw new Response("Not Found", { status: 404 })

	const { domain } = getDomain(request)
	return { page, version, domain }
}

export default function DocumentationStandalonePage({ loaderData }: Route.ComponentProps) {
	const { page } = loaderData
	const {
		sidebarTree: { sections, documentationPages },
	} = useDocumentationLayoutLoaderData()
	const { previous, next } = usePreviousNextPages(sections, documentationPages)

	return <DocumentationPageView page={page} previous={previous} next={next} />
}
