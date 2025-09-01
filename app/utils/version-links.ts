import { redirect } from "react-router"
import { getLatestVersion, isKnownVersion } from "~/utils/versions-utils"

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

/**
 * For (documentation-homepage):
 * - If a version is present but it's the latest or unknown -> redirect to `/home`
 * - Otherwise, use the provided version if known, or fallback to latest
 */
export function resolveHomeVersionOrRedirect(versionParam?: string) {
	if (isUnknownVersion(versionParam) || isLatestVersion(versionParam)) {
		throw redirect("/home")
	}
	return ensureVersion(versionParam)
}

/**
 * For (documentation-layout):
 * - If `params.version` is a known version -> use it
 * - Else, peek the first path segment, if it's a known version -> use it
 * - Else fall back to latest
 */
export function resolveLayoutVersion(paramsVersion: string | undefined, request: Request) {
	if (isKnownVersion(paramsVersion)) return { version: paramsVersion }
	const first = firstPathSegment(request)
	return ensureVersion(isKnownVersion(first) ? first : undefined)
}
