export default function DocumentationHomepage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
			<h1 className="font-bold text-4xl text-[var(--color-text-active)]">Welcome to Our Documentation</h1>
			<p className="mt-6 max-w-2xl text-[var(--color-text-active)] text-lg">
				Explore detailed guides, tutorials, and API references to help you get the most out of our product. Whether
				you’re just starting or looking to deepen your knowledge, you’ll find everything you need here.
			</p>

			<p className="mt-12 text-[var(--color-text-active)] text-sm">
				Select a version and section from the sidebar to get started.
			</p>
		</div>
	)
}
