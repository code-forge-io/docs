import { commandKSearchParamsSchema } from "~/schema/command-k-search-params.schema"

export function parseCommandKSearchParams(request: Request) {
	const url = new URL(request.url)
	const params = Object.fromEntries(url.searchParams.entries())
	const result = commandKSearchParamsSchema.safeParse(params)

	if (!result.success) {
		// biome-ignore lint/suspicious/noConsole: keep for debugging
		console.error("Invalid query parameters:", result.error)
		return { params: null }
	}

	return { params: result.data }
}
