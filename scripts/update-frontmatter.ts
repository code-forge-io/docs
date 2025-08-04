import { exec } from "node:child_process"
import { access, readFile, writeFile } from "node:fs/promises"
import { promisify } from "node:util"
import matter from "gray-matter"

const execAsync = promisify(exec)

async function run(cmd: string) {
	const { stdout } = await execAsync(cmd)
	return stdout.trim()
}

async function fileExists(file: string) {
	try {
		await access(file)
		return true
	} catch {
		return false
	}
}

async function getStagedMdxFiles() {
	const output = await run("git diff --cached --name-only")
	const files = output.split("\n").filter((f) => f.startsWith("content/") && f.endsWith(".mdx"))

	const existenceChecks = await Promise.all(files.map(fileExists))
	return files.filter((_, index) => existenceChecks[index])
}

async function updateFrontmatter(file: string, author: string, date: string) {
	const raw = await readFile(file, "utf-8")
	const parsed = matter(raw)

	parsed.data.author = author
	parsed.data.lastUpdated = date

	const updated = matter.stringify(parsed.content, parsed.data)
	await writeFile(file, updated)

	// biome-ignore lint/suspicious/noConsole: updating file info
	console.log(`✅ Updated ${file}`)

	return file
}

async function main() {
	try {
		const [author, mdxFiles] = await Promise.all([run("git config user.name"), getStagedMdxFiles()])

		if (!mdxFiles.length) {
			// biome-ignore lint/suspicious/noConsole: no files to update
			console.log("📭 No staged MDX files to update.")
			return
		}

		const date = new Date().toISOString().split("T")[0]

		const updatedFiles = await Promise.all(mdxFiles.map((file) => updateFrontmatter(file, author, date)))

		if (updatedFiles.length > 0) {
			await run(`git add ${updatedFiles.join(" ")}`)
		}

		// biome-ignore lint/suspicious/noConsole: completion message
		console.log(`🎉 Successfully updated ${mdxFiles.length} file(s)`)
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: error handling
		console.error("❌ Error:", error)
		process.exit(1)
	}
}

main()
