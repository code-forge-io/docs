import { buildBreadcrumb } from "../build-breadcrumbs"
import type { SidebarSection } from "../sidebar"

type Doc = { slug: string; title: string }
const sec = (over: Partial<SidebarSection>) => ({
	title: "",
	slug: "",
	sectionId: "",
	documentationPages: [],
	subsections: [],
	...over,
})

const doc = (slug: string, title: string): Doc => ({ slug, title })

describe("buildBreadcrumb test suite", () => {
	it("returns [] when pathname doesn't match any doc", () => {
		const items = [
			sec({
				title: "Getting Started",
				slug: "v1/started",
				documentationPages: [doc("v1/started/intro", "Intro")],
			}),
		]

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const result = buildBreadcrumb(items as any, "/v1/started/unknown")
		expect(result).toEqual([])
	})

	it("returns [section, doc] for a top-level doc", () => {
		const items = [
			sec({
				title: "Getting Started",
				slug: "v1/started",
				documentationPages: [doc("v1/started/intro", "Intro")],
			}),
		]

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const result = buildBreadcrumb(items as any, "/v1/started/intro")
		expect(result).toEqual(["Getting Started", "Intro"])
	})

	it("returns full trail for a nested doc (root → sub → doc)", () => {
		const items = [
			sec({
				title: "Configuration",
				slug: "v1/configuration",
				subsections: [
					sec({
						title: "Advanced",
						slug: "v1/configuration/advanced",
						documentationPages: [doc("v1/configuration/advanced/tuning", "Tuning")],
					}),
				],
				documentationPages: [doc("v1/configuration/setup", "Setup")],
			}),
		]

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const result = buildBreadcrumb(items as any, "/v1/configuration/advanced/tuning")
		expect(result).toEqual(["Configuration", "Advanced", "Tuning"])
	})

	it("stops at the first matching branch across multiple roots", () => {
		const items = [
			sec({
				title: "Alpha",
				slug: "v1/alpha",
				documentationPages: [doc("v1/alpha/readme", "Readme")],
			}),
			sec({
				title: "Beta",
				slug: "v1/beta",
				subsections: [
					sec({
						title: "Deep",
						slug: "v1/beta/deep",
						documentationPages: [doc("v1/beta/deep/file", "File")],
					}),
				],
			}),
		]

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const result1 = buildBreadcrumb(items as any, "/v1/alpha/readme")
		expect(result1).toEqual(["Alpha", "Readme"])

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const result2 = buildBreadcrumb(items as any, "/v1/beta/deep/file")
		expect(result2).toEqual(["Beta", "Deep", "File"])
	})
})
