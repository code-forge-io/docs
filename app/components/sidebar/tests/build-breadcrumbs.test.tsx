import { describe, expect, it, vi } from "vitest"
import { buildBreadcrumb } from "../build-breadcrumbs"
import type { SidebarSection } from "../sidebar"

vi.mock("~/utils/versions", () => ({
	versions: ["v1.0.0"] as const,
}))

vi.mock("~/utils/versions-utils", () => ({
	useCurrentVersion: () => "v1.0.0",
	getLatestVersion: () => "v1.0.0",
	isKnownVersion: (v?: string) => v === "v1.0.0",
	// not used here, but we will keeping for consistency
	hrefForHomepage: (v: string) => (v === "v1.0.0" ? "/home" : `/${v}/home`),
}))

type Doc = { slug: string; title: string }
const sec = (over: Partial<SidebarSection>) => ({
	title: "",
	slug: "",
	documentationPages: [],
	subsections: [],
	...over,
})

const doc = (slug: string, title: string): Doc => ({ slug, title })

describe("buildBreadcrumb (versioned paths via splitSlugAndAppendVersion)", () => {
	it("returns [] when pathname doesn't match any doc", () => {
		const items = [
			sec({
				title: "Getting Started",
				slug: "getting-started",
				documentationPages: [doc("getting-started/intro", "Intro")],
			}),
		]

		// biome-ignore lint/suspicious/noExplicitAny: we can use `any` here
		const result = buildBreadcrumb(items as any, "/v1.0.0/getting-started/unknown")
		expect(result).toEqual([])
	})

	it("returns [section, doc] for a top-level doc", () => {
		const items = [
			sec({
				title: "Getting Started",
				slug: "getting-started",
				documentationPages: [doc("getting-started/intro", "Intro")],
			}),
		]
		// biome-ignore lint/suspicious/noExplicitAny: we can use `any` here
		const result = buildBreadcrumb(items as any, "/v1.0.0/getting-started/intro")
		expect(result).toEqual(["Getting Started", "Intro"])
	})

	it("returns full trail for a nested doc (root → sub → doc)", () => {
		const items = [
			sec({
				title: "Configuration",
				slug: "configuration",
				subsections: [
					sec({
						title: "Advanced",
						slug: "configuration/advanced",
						documentationPages: [doc("configuration/advanced/tuning", "Tuning")],
					}),
				],
				documentationPages: [doc("configuration/setup", "Setup")],
			}),
		]
		// biome-ignore lint/suspicious/noExplicitAny: we can use `any` here
		const result = buildBreadcrumb(items as any, "/v1.0.0/configuration/advanced/tuning")
		expect(result).toEqual(["Configuration", "Advanced", "Tuning"])
	})
})
