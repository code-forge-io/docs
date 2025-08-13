import { useRouteLoaderData } from "react-router"
import type { loader } from "~/routes/documentation-layout"

export const useDocumentationLayoutLoaderData = () => {
	const data = useRouteLoaderData<typeof loader>("routes/documentation-layout")
	if (!data) {
		throw new Error(
			"useDocumentationLayoutLoaderData must be used inside a route that is a child of 'documentation-layout' route"
		)
	}
	return data
}
