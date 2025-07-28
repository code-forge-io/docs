import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

function run(cmd: string) {
	return execSync(cmd, { encoding: "utf-8" }).trim()
}

function updateFrontmatter(file: string, author: string, date: string) {
	if (!fs.existsSync(file)) return
	const raw = fs.readFileSync(file, "utf-8")
	const parsed = matter(raw)

	parsed.data.author = author
	parsed.data.lastUpdated = date

	fs.writeFileSync(file, matter.stringify(parsed.content, parsed.data))
	// biome-ignore lint/suspicious/noConsole: <explanation>
	console.log(`✅ Updated ${file}`)
}

function main() {
	const commitHash = run("git rev-parse HEAD")
	const [author, date] = run(`git log -1 --pretty=format:"%an|%ad" --date=short ${commitHash}`).split("|")

	const changedFiles = run(`git diff-tree --no-commit-id --name-only -r ${commitHash}`).split("\n")
	const mdxFiles = changedFiles.filter((f) => f.startsWith("content/") && f.endsWith(".mdx"))

	if (!mdxFiles.length) {
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log("No MDX files changed in last commit.")
		return
	}

	for (const file of mdxFiles) {
		updateFrontmatter(path.join(process.cwd(), file), author, date)
	}
}

main()
