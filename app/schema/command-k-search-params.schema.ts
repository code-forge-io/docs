import z from "zod"
import { versions } from "~/utils/versions"

export const commandKSearchParamsSchema = z.object({
	query: z.string(),
	version: z.enum(versions),
})
