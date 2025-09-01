import { redirect } from "react-router"
import { getLatestVersion, isKnownVersion } from "./versions-utils"

function firstPathSegment(request: Request) {
	return new URL(request.url).pathname.split("/").filter(Boolean)[0]
}

function isUnknownVersion(v?: string) {
	return typeof v === "string" && !isKnownVersion(v)
}

function isLatestVersion(v?: string) {
	return typeof v === "string" && v === getLatestVersion()
}

export function ensureVersion(v?: string) {
	return { version: isKnownVersion(v) ? v : getLatestVersion() }
}

export function resolveHomeVersionOrRedirect(versionParam?: string) {
	if (isUnknownVersion(versionParam) || isLatestVersion(versionParam)) {
		throw redirect("/home")
	}
	return ensureVersion(versionParam)
}

export function resolveLayoutVersion(paramsVersion: string | undefined, request: Request) {
	if (isKnownVersion(paramsVersion)) return { version: paramsVersion }
	const first = firstPathSegment(request)
	return ensureVersion(isKnownVersion(first) ? first : undefined)
}

function homepageUrl(base: string, version: string) {
	return `${base}/${version}/home`
}

export function pageUrl(base: string, version: string, slug: string) {
	return slug === "_index" ? homepageUrl(base, version) : `${base}/${version}/${slug}`
}
