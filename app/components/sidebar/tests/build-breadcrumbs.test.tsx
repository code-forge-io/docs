import { describe, expect, it, vi } from "vitest"
import { buildBreadcrumb } from "../build-breadcrumbs"
import type { SidebarSection } from "../sidebar"

vi.mock("~/utils/versions-utils", async () => {
	const actual = await vi.importActual<typeof import("~/utils/versions-utils")>("~/utils/versions-utils")
	return {
		...actual,
		useCurrentVersion: () => "v1.0.0",
		getLatestVersion: () => "v1.0.0",
		isKnownVersion: (v?: string) => v === "v1.0.0",
	}
})

vi.mock("~/utils/versions", async () => {
	const actual = await vi.importActual<typeof import("~/utils/versions")>("~/utils/versions")
	return {
		...actual,
		versions: ["v1.0.0"] as const,
	}
})

type Doc = { slug: string; title: string }
const makeDoc = (slug: string, title: string): Doc => ({ slug, title })

type MinimalSection = Pick<SidebarSection, "title" | "slug" | "documentationPages" | "subsections">
const makeSection = (overrides: Partial<MinimalSection> = {}): SidebarSection => ({
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

		const result = buildBreadcrumb(items, "/v1.0.0/getting-started/unknown")
		expect(result).toEqual([])
	})

	it("returns [section, doc] for a top-level doc", () => {
		const items = [
			makeSection({
				title: "Getting Started",
				slug: "getting-started",
				documentationPages: [makeDoc("getting-started/intro", "Intro")],
			}),
		]

		const result = buildBreadcrumb(items, "/v1.0.0/getting-started/intro")
		expect(result).toEqual(["Getting Started", "Intro"])
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

		const result = buildBreadcrumb(items, "/v1.0.0/configuration/advanced/tuning")
		expect(result).toEqual(["Configuration", "Advanced", "Tuning"])
	})
})
