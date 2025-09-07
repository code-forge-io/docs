import { describe, expect, it, vi } from "vitest"
import type { SidebarSection } from "../sidebar"

vi.mock("~/utils/split-slug", () => ({
	splitSlug: (slug: string) => {
		const parts = slug.split("/").filter(Boolean)

		if (parts.length === 2) {
			const [section, filename] = parts
			return { section, filename }
		}
		if (parts.length === 3) {
			const [section, subsection, filename] = parts
			return { section, subsection, filename }
		}

		throw new Error(`Bad slug in test: ${slug}`)
	},
}))

import { buildBreadcrumb } from "../build-breadcrumbs"

type Doc = { slug: string; title: string }
const makeDoc = (slug: string, title: string): Doc => ({ slug, title })

type MinimalSection = Pick<SidebarSection, "title" | "slug" | "documentationPages" | "subsections">
const makeSection = (overrides: Partial<MinimalSection> = {}) => ({
	title: "",
	slug: "",
	documentationPages: [],
	subsections: [],
	...overrides,
})

describe("buildBreadcrumb", () => {
	it("returns [] when pathname doesn't match any doc", () => {
		const items = [
			makeSection({
				title: "Getting Started",
				slug: "getting-started",
				documentationPages: [makeDoc("getting-started/intro", "Intro")],
			}),
		]
		expect(buildBreadcrumb(items, "/getting-started/unknown")).toEqual([])
	})

	it("returns [section, doc] for a top-level doc", () => {
		const items = [
			makeSection({
				title: "Getting Started",
				slug: "getting-started",
				documentationPages: [makeDoc("getting-started/intro", "Intro")],
			}),
		]
		expect(buildBreadcrumb(items, "/getting-started/intro")).toEqual(["Getting Started", "Intro"])
	})

	it("returns full trail for a nested doc (root → sub → doc)", () => {
		const items = [
			makeSection({
				title: "Configuration",
				slug: "configuration",
				subsections: [
					makeSection({
						title: "Advanced",
						slug: "configuration/advanced",
						documentationPages: [makeDoc("configuration/advanced/tuning", "Tuning")],
					}),
				],
				documentationPages: [makeDoc("configuration/setup", "Setup")],
			}),
		]
		expect(buildBreadcrumb(items, "/configuration/advanced/tuning")).toEqual(["Configuration", "Advanced", "Tuning"])
	})

	it("returns [] for an empty sidebar", () => {
		const items: MinimalSection[] = []
		expect(buildBreadcrumb(items, "/any-path")).toEqual([])
	})
})
