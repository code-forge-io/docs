import { defineDocsConfig } from "./docs-config/docs.schema"

export default defineDocsConfig({
	// Choose ONE of the three below: latest | exact | ranges
	versions: {
		latest: 2, // keep the last 2 releases (e.g., v1.4.0 and v1.3.0)
		// exact: ["v1.4.0", "v1.2.3"], // <- explicitly build docs for these tags only
		// ranges: ["^1.3.0", ">=1.0.0 <1.2.0"], // <- semver-style strings
	},

	content: {
		// Root folder where docs live
		docsDir: "docs",
	},

	output: {
		// Folder where your generator writes processed/compiled docs
		baseDir: "generated-docs",
	},
})
