import { href, redirect } from "react-router"
import { renderLlmsTxt } from "~/utils/llms-utils"
import { getLatestVersion, resolveVersion } from "~/utils/versions-utils"
import type { Route } from "./+types/llms[.]txt"

export async function loader({ request, params }: Route.LoaderArgs) {
	const { version: paramVersion } = params

	if (!paramVersion) {
		const latest = getLatestVersion()
		return redirect(href("/:version?/llms.txt", { version: latest }))
	}

	const version = resolveVersion(paramVersion)
	const body = await renderLlmsTxt({
		request,
		version,
		title: "Documentation Template",
		tagline: "Official documentation and guides.",
	})

	return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
