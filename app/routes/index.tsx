import { href, useNavigate } from "react-router"
import { Header } from "~/components/header"
import { Logo } from "~/components/logo"
import { Icon } from "~/ui/icon/icon"
import { getLatestVersion } from "~/utils/versions-utils"
export default function Index() {
	const navigate = useNavigate()
	// TODO Use i18next
	return (
		<div className="flex min-h-screen flex-col bg-[var(--color-background)] 2xl:container 2xl:mx-auto">
			<Header>
				<Logo>
					<span className="p-0">REACT ROUTER DEVTOOLS</span>
				</Logo>
			</Header>
			<main className="flex flex-1 items-center justify-center">
				<div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-info-border)] bg-[var(--color-info-bg)] px-3 py-1 text-[var(--color-info-text)] text-sm">
						<Icon name="Zap" className="size-4" />
						Version {getLatestVersion()} Now Available
					</div>

					<h1 className="font-bold text-5xl text-[var(--color-text-active)] leading-snug">
						Professional Development
						<br />
						<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Made Simple
						</span>
					</h1>

					<div className="mb-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 transition-colors hover:shadow-lg">
							<h3 className="mb-2 font-semibold text-[var(--color-text-active)] text-lg">Smart Debugging</h3>

							<p className="text-[var(--color-text-normal)]">
								Advanced debugging tools with real-time error tracking and performance insights.
							</p>
						</div>

						<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 transition-colors hover:shadow-lg">
							<h3 className="mb-2 font-semibold text-[var(--color-text-active)] text-lg">Lightning Fast</h3>

							<p className="text-[var(--color-text-normal)]">
								Optimized performance with hot reload and instant feedback during development.
							</p>
						</div>

						<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 transition-colors hover:shadow-lg">
							<h3 className="mb-2 font-semibold text-[var(--color-text-active)] text-lg">Comprehensive Docs</h3>

							<p className="text-[var(--color-text-normal)]">
								Complete documentation with examples, guides, and best practices.
							</p>
						</div>
					</div>

					<div className="flex items-center justify-center gap-4">
						<button
							type="button"
							onClick={() => navigate(href("/:version?/home"))}
							className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
						>
							<Icon name="Rocket" className="size-5" />
							Get Started
						</button>

						<button
							type="button"
							className="flex items-center gap-2 rounded-lg bg-[var(--color-background-active)] px-6 py-3 font-medium text-[var(--color-text-active)] transition-colors"
						>
							<Icon name="Github" className="size-5" />
							{/* TODO add github repo url */}
							View on GitHub
						</button>
					</div>
				</div>
			</main>
		</div>
	)
}
