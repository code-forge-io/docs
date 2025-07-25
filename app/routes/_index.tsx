import { useTranslation } from "react-i18next"
import type { MetaFunction } from "react-router"

export const meta: MetaFunction = () => {
	return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }]
}

export default function Index() {
	const { t } = useTranslation()

	return (
		// TODO change this to desired layout
		<div className="flex min-h-screen">
			<main className="flex-1 p-8">
				<h1>{t("hi")}</h1>
			</main>
		</div>
	)
}
