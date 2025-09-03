import { describe, expect, it, vi } from "vitest"
import type { SidebarSection } from "../sidebar"

vi.mock("~/utils/split-slug-and-append-version", () => ({
	splitSlugAndAppendVersion: (slug: string) => {
		const parts = slug.split("/").filter(Boolean)
		const version = "v1.0.0"

		if (parts.length === 2) {
			const [section, filename] = parts
			return { version, section, filename }
		}
		if (parts.length === 3) {
			const [section, subsection, filename] = parts
			return { version, section, subsection, filename }
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

describe("buildBreadcrumb (versioned paths via splitSlugAndAppendVersion)", () => {
	it("returns [] when pathname doesn't match any doc", () => {
		const items = [
			makeSection({
				title: "Getting Started",
				slug: "getting-started",
				documentationPages: [makeDoc("getting-started/intro", "Intro")],
			}),
		]
		expect(buildBreadcrumb(items, "/v1.0.0/getting-started/unknown")).toEqual([])
	})

	it("returns [section, doc] for a top-level doc", () => {
		const items = [
			makeSection({
				title: "Getting Started",
				slug: "getting-started",
				documentationPages: [makeDoc("getting-started/intro", "Intro")],
			}),
		]
		expect(buildBreadcrumb(items, "/v1.0.0/getting-started/intro")).toEqual(["Getting Started", "Intro"])
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
		expect(buildBreadcrumb(items, "/v1.0.0/configuration/advanced/tuning")).toEqual([
			"Configuration",
			"Advanced",
			"Tuning",
		])
	})
})
