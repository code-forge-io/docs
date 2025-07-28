import { useTranslation } from "react-i18next"
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from "react-router"
import type { LinksFunction } from "react-router"
import { useChangeLanguage } from "remix-i18next/react"
import type { Route } from "./+types/root"
import { ClientHintCheck, getHints } from "./services/client-hints"
import tailwindcss from "./tailwind.css?url"
import { fonts } from "./utils/fonts"

export async function loader({ context, request }: Route.LoaderArgs) {
	const { lang, clientEnv } = context
	const hints = getHints(request)
	return { lang, clientEnv, hints }
}

export const links: LinksFunction = () => [{ rel: "stylesheet", href: tailwindcss }]

export const handle = {
	i18n: "common",
}

export default function App({ loaderData }: Route.ComponentProps) {
	const { lang, clientEnv } = loaderData
	useChangeLanguage(lang)
	const fontFaceRules = fonts
		.map(
			(font) => `
                @font-face {
                    font-family: "${font.fontFamily}";
                    font-style: ${font.fontStyle};
                    font-weight: ${font.fontWeight};
                    src: url(${font.src}) format("truetype");
                    font-display: swap;
                }
            `
		)
		.join("\n")
	return (
		<>
			<Outlet />
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: We set the window.env variable to the client env */}
			<script dangerouslySetInnerHTML={{ __html: `window.env = ${JSON.stringify(clientEnv)}` }} />
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: fonts loading*/}
			<style dangerouslySetInnerHTML={{ __html: fontFaceRules }} />
		</>
	)
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
	const { i18n } = useTranslation()
	return (
		<html className="overflow-y-auto overflow-x-hidden" lang={i18n.language} dir={i18n.dir()}>
			<head>
				<ClientHintCheck />
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: TODO change this
					dangerouslySetInnerHTML={{
						__html: `
			(function () {
				try {
					var theme = localStorage.getItem("theme");
					if (!theme) {
						theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
					}
					document.documentElement.setAttribute("data-theme", theme);
				} catch (_) {}
			})();
		`,
					}}
				/>

				<Meta />
				<Links />
			</head>
			<body className="h-full w-full bg-[var(--color-background)]">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export const ErrorBoundary = () => {
	const error = useRouteError()
	const { t } = useTranslation()
	// Constrain the generic type so we don't provide a non-existent key
	const statusCode = () => {
		if (!isRouteErrorResponse(error)) {
			return "500"
		}
		// Supported error code messages
		switch (error.status) {
			case 200:
				return "200"
			case 403:
				return "403"
			case 404:
				return "404"
			default:
				return "500"
		}
	}
	const errorStatusCode = statusCode()

	return (
		<div className="relative flex h-full min-h-screen w-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 placeholder-index sm:pt-8 sm:pb-16 dark:bg-white dark:from-blue-950 dark:to-blue-900">
			<div className="relative mx-auto max-w-[90rem] sm:px-6 lg:px-8">
				<div className="relative flex min-h-72 flex-col justify-center p-1 sm:overflow-hidden sm:rounded-2xl md:p-4 lg:p-6">
					<h1 className="w-full pb-2 text-center text-2xl text-red-600">{t(`error.${errorStatusCode}.title`)}</h1>
					<p className="w-full text-center text-lg dark:text-white">{t(`error.${errorStatusCode}.description`)}</p>
				</div>
			</div>
		</div>
	)
}
