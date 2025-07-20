import path from "node:path"
import { fileURLToPath } from "node:url"
import chalk from "chalk"
import fs from "fs-extra"
import matter from "gray-matter"

//TODO refactor this
type SidebarEntry = {
	title: string
	position: number
	slug: string
	type: "section" | "subsection" | "page"
	children?: SidebarEntry[]
	filePath: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const CONTENT_ROOT = path.resolve(__dirname, "../content", "v1.0.1") //TODO remove hardcoded version

// biome-ignore lint/suspicious/noConsole: <explanation>
console.log(chalk.bold.blue("Content Root:"), CONTENT_ROOT)

async function parseFrontmatter(filePath: string) {
	try {
		const content = await fs.readFile(filePath, "utf8")
		const { data } = matter(content)
		if (typeof data.title === "string" && typeof data.position === "number") {
			return { title: data.title, position: data.position }
		}
	} catch {}
	return null
}

async function buildPageEntry(filePath: string): Promise<SidebarEntry | null> {
	const meta = await parseFrontmatter(filePath)
	if (!meta) return null

	const slug = filePath.replace(`${CONTENT_ROOT}/`, "").replace(/\.mdx$/, "")
	return {
		title: meta.title,
		position: meta.position,
		slug,
		type: "page",
		filePath,
	}
}

async function scanDirectory(dirPath: string, depth = 0): Promise<SidebarEntry[]> {
	const entries = await fs.readdir(dirPath, { withFileTypes: true })
	const results: SidebarEntry[] = []

	await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.join(dirPath, entry.name)

			if (entry.isDirectory()) {
				const indexPath = path.join(fullPath, "index.md")
				if (!(await fs.pathExists(indexPath))) return

				const meta = await parseFrontmatter(indexPath)
				if (!meta) return

				const children = await scanDirectory(fullPath, depth + 1)
				const slug = fullPath.replace(`${CONTENT_ROOT}/`, "")

				results.push({
					title: meta.title,
					position: meta.position,
					slug,
					type: depth === 0 ? "section" : "subsection",
					children,
					filePath: indexPath,
				})
				return
			}

			if (entry.name.endsWith(".mdx")) {
				const page = await buildPageEntry(fullPath)
				if (page) results.push(page)
			}
		})
	)

	return results
}

async function getTopLevelPages(): Promise<SidebarEntry[]> {
	const entries = await fs.readdir(CONTENT_ROOT)
	const results: SidebarEntry[] = []

	await Promise.all(
		entries.map(async (entry) => {
			if (!entry.endsWith(".mdx")) return

			const filePath = path.join(CONTENT_ROOT, entry)
			const page = await buildPageEntry(filePath)
			if (page) results.push(page)
		})
	)

	return results
}

function validateAndPrint(entries: SidebarEntry[], prefix = "") {
	const seen = new Map<number, SidebarEntry>()

	for (const entry of entries) {
		if (seen.has(entry.position)) {
			// biome-ignore lint/suspicious/noConsole: <explanation>
			console.warn(chalk.red(`❌ Duplicate position ${entry.position} at "${entry.filePath}"`))
		}
		seen.set(entry.position, entry)
	}

	const sorted = [...seen.entries()].sort(([a], [b]) => a - b)

	sorted.forEach(([pos, entry], i) => {
		const expected = i + 1
		if (pos !== expected) {
			// biome-ignore lint/suspicious/noConsole: <explanation>
			console.warn(chalk.yellow(`⚠️ Position mismatch in "${entry.filePath}": expected ${expected}, found ${pos}`))
		}

		const index = prefix ? `${prefix}.${expected}` : `${expected}`
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log(chalk.green(`${index}. ${entry.title} (${entry.slug})`))

		if (entry.children?.length) {
			validateAndPrint(entry.children, index)
		}
	})
}

async function main() {
	try {
		const nestedEntries = await scanDirectory(CONTENT_ROOT)
		const standalonePages = await getTopLevelPages()
		const allEntries = [...nestedEntries, ...standalonePages]

		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.log(chalk.bold.blue("\nSidebar Tree\n---------------------"))
		validateAndPrint(allEntries)
	} catch (err) {
		// biome-ignore lint/suspicious/noConsole: <explanation>
		console.error(chalk.bgRed.white("Script failed:"), err)
		process.exit(1)
	}
}

main()
