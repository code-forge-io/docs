import { href, redirect } from "react-router"
import { versions } from "./versions"

export type Version = (typeof versions)[number]

export const getLatestVersion = () => versions[0]

export const isKnownVersion = (v: string | undefined): v is Version =>
	typeof v === "string" && versions.includes(v as Version)

function isUnknownVersion(v?: string) {
	return typeof v === "string" && !isKnownVersion(v)
}

export function normalizeVersion(v?: string) {
	return { version: isKnownVersion(v) ? v : getLatestVersion() }
}

// export function getCurrentVersion(params: { version?: string }) {
// 	return normalizeVersion(params.version)
// }

export function resolveVersionForHomepage(version?: string) {
	if (isUnknownVersion(version) || getLatestVersion() === version) {
		throw redirect("/home")
	}
	return normalizeVersion(version)
}

function homepageUrl(base: string, version: string) {
	return `${base}/${version}/home`
}

export function pageUrlWithVersion(base: string, version: string, slug: string) {
	return slug === "_index" ? homepageUrl(base, version) : `${base}/${version}/${slug}`
}

function firstPathSegment(request: Request) {
	return new URL(request.url).pathname.split("/").filter(Boolean)[0]
}

export function resolveVersionForLayout(version: string | undefined, request: Request) {
	if (isKnownVersion(version)) return { version }
	const first = firstPathSegment(request)
	return normalizeVersion(first)
}

export const homepageUrlWithVersion = (v: string) =>
	v === getLatestVersion() ? href("/:version?/home") : href("/:version?/home", { version: v })
