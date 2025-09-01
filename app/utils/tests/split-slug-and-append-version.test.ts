const versionsMock = ["v1.0.0"] as const

vi.mock("~/utils/versions", () => ({
	versions: versionsMock,
}))

vi.mock("../versions-utils", () => {
	return {
		getLatestVersion: vi.fn(() => versionsMock[0]),
		isKnownVersion: vi.fn(() => versionsMock[0]),
		useCurrentVersion: vi.fn(() => versionsMock[0]),
	}
})
import { splitSlugAndAppendVersion } from "../split-slug-and-append-version"

describe("splitSlug test suite", () => {
	it("splits a slug with 2 parts (no subsection)", () => {
		const result = splitSlugAndAppendVersion("getting-started/intro")
		expect(result).toEqual({
			version: "v1.0.0",
			section: "getting-started",
			filename: "intro",
		})
	})

	it("splits a slug with 3 parts (with subsection)", () => {
		const result = splitSlugAndAppendVersion("getting-started/basics/intro")
		expect(result).toEqual({
			version: "v1.0.0",
			section: "getting-started",
			subsection: "basics",
			filename: "intro",
		})
	})

	it("throws if slug has less than 2 parts", () => {
		expect(() => splitSlugAndAppendVersion("getting-started")).toThrowError(
			/expected "section\/page" or "section\/subsection\/page"/i
		)
	})

	it("throws if slug has more than 3 parts", () => {
		expect(() => splitSlugAndAppendVersion("section/subsection/file/extra")).toThrowError(
			/expected "section\/page" or "section\/subsection\/page"/i
		)
	})

	it("handles numeric or dashed parts", () => {
		const result = splitSlugAndAppendVersion("01-intro/02-basics/file-name")
		expect(result).toEqual({
			version: "v1.0.0",
			section: "01-intro",
			subsection: "02-basics",
			filename: "file-name",
		})
	})

	it("handles special characters in parts", () => {
		const result = splitSlugAndAppendVersion("@special$/#weird$/file-name")
		expect(result).toEqual({
			version: "v1.0.0",
			section: "@special$",
			subsection: "#weird$",
			filename: "file-name",
		})
	})

	it("handles uppercase letters in slug", () => {
		const result = splitSlugAndAppendVersion("GettingStarted/Intro")
		expect(result).toEqual({
			version: "v1.0.0",
			section: "GettingStarted",
			filename: "Intro",
		})
	})
})
