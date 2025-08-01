import { execSync } from "node:child_process"
import fs from "node:fs"
import matter from "gray-matter"

function run(cmd: string): string {
	return execSync(cmd, { encoding: "utf-8" }).trim()
}

function getStagedMdxFiles(): string[] {
	const output = run("git diff --cached --name-only")
	return output.split("\n").filter((f) => f.startsWith("content/") && f.endsWith(".mdx") && fs.existsSync(f))
}

function updateFrontmatter(file: string, author: string, date: string) {
	const raw = fs.readFileSync(file, "utf-8")
	const parsed = matter(raw)

	parsed.data.author = author
	parsed.data.lastUpdated = date

	fs.writeFileSync(file, matter.stringify(parsed.content, parsed.data))

	run(`git add ${file}`)

	// biome-ignore lint/suspicious/noConsole: updating file info
	console.log(`✅ Updated ${file}`)
}

function main() {
	const author = run("git config user.name")
	const date = new Date().toISOString().split("T")[0]

	const mdxFiles = getStagedMdxFiles()

	if (!mdxFiles.length) {
		// biome-ignore lint/suspicious/noConsole: no files to update
		console.log("📭 No staged MDX files to update.")
		return
	}

	for (const file of mdxFiles) {
		updateFrontmatter(file, author, date)
	}
}

main()
