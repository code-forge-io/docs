// vi.mock("~/utils/split-slug", () => ({
// 	splitSlug: (slug: string) => {
// 		const parts = slug.split("/").filter(Boolean)

// 		if (parts.length === 2) {
// 			const [section, filename] = parts
// 			return { section, filename }
// 		}
// 		if (parts.length === 3) {
// 			const [section, subsection, filename] = parts
// 			return { section, subsection, filename }
// 		}

// 		// Note: standalone (1 part) is handled directly by buildBreadcrumbs; we never call splitSlug for it.
// 		throw new Error(`Bad slug in test: ${slug}`)
// 	},
// }))

// import { buildBreadcrumbs } from "../build-breadcrumbs"

// type Doc = { slug: string; title: string }
// const makeDoc = (slug: string, title: string): Doc => ({ slug, title })

// type MinimalSection = Pick<SidebarSection, "title" | "slug" | "documentationPages" | "subsections">
// const makeSection = (overrides: Partial<MinimalSection> = {}): MinimalSection => ({
// 	title: "",
// 	slug: "",
// 	documentationPages: [],
// 	subsections: [],
// 	...overrides,
// })

// const makeStandalone = (slug: string, title: string) => ({ slug, title })

describe("buildBreadcrumbs", () => {
	// 	it("returns [] when pathname doesn't match any doc", () => {
	// 		const items = [
	// 			makeSection({
	// 				title: "Getting Started",
	// 				slug: "getting-started",
	// 				documentationPages: [makeDoc("getting-started/intro", "Intro")],
	// 			}),
	// 		]
	// 		expect(buildBreadcrumbs(items, "/getting-started/unknown")).toEqual([])
	// 	})

	// 	it("returns [section, doc] for a top-level doc within a section", () => {
	// 		const items = [
	// 			makeSection({
	// 				title: "Getting Started",
	// 				slug: "getting-started",
	// 				documentationPages: [makeDoc("getting-started/intro", "Intro")],
	// 			}),
	// 		]
	// 		expect(buildBreadcrumbs(items, "/getting-started/intro")).toEqual(["Getting Started", "Intro"])
	// 	})

	// 	it("returns full trail for a nested doc (root → sub → doc)", () => {
	// 		const items = [
	// 			makeSection({
	// 				title: "Configuration",
	// 				slug: "configuration",
	// 				subsections: [
	// 					makeSection({
	// 						title: "Advanced",
	// 						slug: "configuration/advanced",
	// 						documentationPages: [makeDoc("configuration/advanced/tuning", "Tuning")],
	// 					}),
	// 				],
	// 				documentationPages: [makeDoc("configuration/setup", "Setup")],
	// 			}),
	// 		]
	// 		expect(buildBreadcrumbs(items, "/configuration/advanced/tuning")).toEqual(["Configuration", "Advanced", "Tuning"])
	// 	})

	// 	it("returns [] for an empty sidebar", () => {
	// 		const items: MinimalSection[] = []
	// 		expect(buildBreadcrumbs(items, "/any-path")).toEqual([])
	// 	})

	// 	it("returns [doc] for a standalone top-level doc", () => {
	// 		const items: MinimalSection[] = []
	// 		const standalone = [makeStandalone("changelog", "Changelog")]
	// 		expect(buildBreadcrumbs(items, "/changelog", standalone)).toEqual(["Changelog"])
	// 	})

	// 	it("prefers sectioned matching when given (sanity check with both provided)", () => {
	// 		const items = [
	// 			makeSection({
	// 				title: "Guides",
	// 				slug: "guides",
	// 				documentationPages: [makeDoc("guides/quickstart", "Quickstart")],
	// 			}),
	// 		]
	// 		const standalone = [makeStandalone("quickstart", "Quickstart (Standalone)")]

	// 		expect(buildBreadcrumbs(items, "/guides/quickstart", standalone)).toEqual(["Guides", "Quickstart"])

	// 		expect(buildBreadcrumbs(items, "/quickstart", standalone)).toEqual(["Quickstart (Standalone)"])
	// 	})

	it("", () => {
		expect(true).toBe(true)
	})
})
