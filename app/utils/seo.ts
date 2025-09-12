import { generateMeta } from "@forge42/seo-tools/remix/metadata"
import type { MetaDescriptor } from "react-router"
import PackageLogo from "../../public/statics/images/package-logo.png"

interface MetaFields {
	domain: string
	title: string
	description: string
	path: string
	additionalData?: MetaDescriptor[]
}

export function generateMetaFields({ domain, title, description, path, additionalData }: MetaFields) {
	const fullUrl = `${domain}${path}`
	const image = `${domain}/${PackageLogo}`

	return generateMeta(
		{
			title,
			description,
			url: fullUrl,
			// Change to your package name
			siteName: "Package Name",
			image: `${image}-1200x630.png`,
		},
		[
			// Open Graph
			{ property: "og:type", content: "website" },
			...(additionalData ?? []),
		]
	)
}
