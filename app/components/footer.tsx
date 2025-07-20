import { useRouteLoaderData } from "react-router"

interface FooterProps {
	pagePath: string
}

export function Footer({ pagePath }: FooterProps) {
	// TODO use i18next for translations
	const { clientEnv } = useRouteLoaderData("root")
	const { GITHUB_OWNER, GITHUB_REPO } = clientEnv
	const githubBase = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`
	const editUrl = `${githubBase}/edit/main/content/${pagePath}`

	const issueTitle = `Issue with the "${pagePath}" doc`
	const issueBody = createIssueTemplate(pagePath, githubBase)

	const issueUrl = `${githubBase}/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`

	return (
		<footer className="bottom-0 mt-auto flex flex-col items-center gap-2 p-6 pt-12 text-[var(--color-text-active)] text-sm">
			<div className="flex gap-4">
				<a
					href={issueUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-[var(--color-text-accent)] hover:underline"
				>
					Report an issue
				</a>
				<span>|</span>
				<a
					href={editUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-[var(--color-text-accent)] hover:underline"
				>
					Edit this page on GitHub
				</a>
			</div>
			<div className="mt-2 text-[var(--color-text-active)] text-xs">
				© {new Date().getFullYear()} {GITHUB_OWNER}. All rights reserved.
			</div>
		</footer>
	)
}

function createIssueTemplate(pagePath: string, githubBase: string) {
	return `I found an issue with this document.

**Title:** ${pagePath}
**Source:** ${githubBase}/blob/main/content/${pagePath}

### Describe the issue
<!-- Describe the issue and include the section you're referring to, if applicable. Provide lots of detail about the issue that you found. -->

### Additional info
<!-- Add any other context about the issue here. If applicable, add screenshots to help explain the issue. -->`
}
