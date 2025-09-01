import { renderLlmsTxt } from "~/utils/llms-utils"
import type { Route } from "./+types/llms[.]txt"

export async function loader({ request }: Route.LoaderArgs) {
	const body = await renderLlmsTxt(request, {
		title: "Documentation Template",
		tagline: "Official documentation and guides.",
	})
	return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
