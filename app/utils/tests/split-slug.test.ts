import { splitSlug } from "../split-slug"

describe("splitSlug test suite", () => {
	it("should split a slug with 3 parts (no subsection)", () => {
		const result = splitSlug("v1.0.0/getting-started/intro")
		expect(result).toEqual({
			version: "v1.0.0",
			section: "getting-started",
			subsection: undefined,
			filename: "intro",
		})
	})

	it("should split a slug with 4 parts (with subsection)", () => {
		const result = splitSlug("v1.0.0/getting-started/basics/intro")
		expect(result).toEqual({
			version: "v1.0.0",
			section: "getting-started",
			subsection: "basics",
			filename: "intro",
		})
	})

	it("should throw if slug has less than 3 parts", () => {
		expect(() => splitSlug("v1.0.0/getting-started")).toThrowError(/expected 3 or 4 segments/i)
	})

	it("should throw if slug has more than 4 parts", () => {
		expect(() => splitSlug("v1.0.0/section/subsection/file/extra")).toThrowError(/expected 3 or 4 segments/i)
	})

	it("should handle numeric or dashed parts", () => {
		const result = splitSlug("v2.3.4/01-intro/02-basics/file-name")
		expect(result).toEqual({
			version: "v2.3.4",
			section: "01-intro",
			subsection: "02-basics",
			filename: "file-name",
		})
	})

	it("should handle version without 'v' prefix", () => {
		const result = splitSlug("1.0.0/setup/install")
		expect(result).toEqual({
			version: "1.0.0",
			section: "setup",
			subsection: undefined,
			filename: "install",
		})
	})

	it("should handle special characters in parts", () => {
		const result = splitSlug("v1.0.0/@special$/#weird$/file-name")
		expect(result).toEqual({
			version: "v1.0.0",
			section: "@special$",
			subsection: "#weird$",
			filename: "file-name",
		})
	})

	it("should handle uppercase letters in slug", () => {
		const result = splitSlug("v1.0.0/GettingStarted/Intro")
		expect(result).toEqual({
			version: "v1.0.0",
			section: "GettingStarted",
			subsection: undefined,
			filename: "Intro",
		})
	})
})
