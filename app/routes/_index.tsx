import { Link, type MetaFunction, href } from "react-router"

export const meta: MetaFunction = () => {
	return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }]
}

export default function Index() {
	return (
		// TODO change this to desired layout
		<div className="flex min-h-screen">
			<main className="flex-1 p-8">
				<Link type="button" className="rounded-2xl border p-2 font-bold text-2xl" to={href("/docs")}>
					Click to go to the Documentation Homepage
				</Link>
			</main>
		</div>
	)
}
