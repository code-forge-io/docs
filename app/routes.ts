import { type RouteConfig, index, layout, route } from "@react-router/dev/routes"

export default [
	layout("routes/documentation-layout.tsx", [
		index("routes/documentation-homepage.tsx"),
		route(":version/:section/:subsection?/:filename", "routes/documentation-page.tsx"),
	]),
	route("sitemap-index.xml", "routes/sitemap-index[.]xml.ts"),
	route("robots.txt", "routes/robots[.]txt.ts"),
	route("resource/*", "routes/resource.locales.ts"),
	route("$", "routes/$.tsx"),
	route("sitemap/:lang.xml", "routes/sitemap.$lang[.]xml.ts"),
] satisfies RouteConfig
