import { describe, expect, it, vi } from "vitest"

vi.mock("../version-resolvers", () => ({
	getLatestVersion: () => "v1.0.0",
	isKnownVersion: (v?: string) => v === "v1.0.0",
	getCurrentVersion: () => ({ version: "v1.0.0" }),
}))

vi.mock("../versions", () => ({
	versions: ["v1.0.0"] as const,
}))

import { splitSlugAndAppendVersion } from "../split-slug-and-append-version"

describe("splitSlug test suite", () => {
	it("splits a slug with 2 parts (no subsection)", () => {
		expect(splitSlugAndAppendVersion("getting-started/intro")).toEqual({
			version: "v1.0.0",
			section: "getting-started",
			filename: "intro",
		})
	})

	it("splits a slug with 3 parts (with subsection)", () => {
		expect(splitSlugAndAppendVersion("getting-started/basics/intro")).toEqual({
			version: "v1.0.0",
			section: "getting-started",
			subsection: "basics",
			filename: "intro",
		})
	})

	it("throws if slug has less than 2 parts", () => {
		expect(() => splitSlugAndAppendVersion("getting-started")).toThrow(
			/expected "section\/page" or "section\/subsection\/page"/i
		)
	})

	it("throws if slug has more than 3 parts", () => {
		expect(() => splitSlugAndAppendVersion("section/subsection/file/extra")).toThrow(
			/expected "section\/page" or "section\/subsection\/page"/i
		)
	})

	it("handles numeric or dashed parts", () => {
		expect(splitSlugAndAppendVersion("01-intro/02-basics/file-name")).toEqual({
			version: "v1.0.0",
			section: "01-intro",
			subsection: "02-basics",
			filename: "file-name",
		})
	})

	it("handles special characters in parts", () => {
		expect(splitSlugAndAppendVersion("@special$/#weird$/file-name")).toEqual({
			version: "v1.0.0",
			section: "@special$",
			subsection: "#weird$",
			filename: "file-name",
		})
	})

	it("handles uppercase letters in slug", () => {
		expect(splitSlugAndAppendVersion("GettingStarted/Intro")).toEqual({
			version: "v1.0.0",
			section: "GettingStarted",
			filename: "Intro",
		})
	})
})
