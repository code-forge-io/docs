import { redirect } from "react-router"
import { getLatestVersion, isKnownVersion } from "~/utils/versions-utils"

// extract the first non-empty path segment from a request
function firstPathSegment(request: Request) {
	return new URL(request.url).pathname.split("/").filter(Boolean)[0]
}

// checks if a provided version string exists but is NOT one of known versions
function isUnknownVersion(v?: string) {
	return typeof v === "string" && !isKnownVersion(v)
}

// checks if a provided version string exists and equals the current latest
function isLatestVersion(v?: string) {
	return typeof v === "string" && v === getLatestVersion()
}

// if version is known, return it, otherwise return the latest
export function ensureVersion(v?: string) {
	return { version: isKnownVersion(v) ? v : getLatestVersion() }
}

/**
 * For /:version?/home (documentation-homepage):
 * - If a version is present but it's the latest -> redirect to (versionless) `/home`
 * - If a version is present but unknown -> redirect to (versionless) `/home`
 * - Otherwise, use the provided version if known, or fall back to latest
 */
export function resolveHomeVersionOrRedirect(versionParam?: string) {
	if (isUnknownVersion(versionParam) || isLatestVersion(versionParam)) {
		throw redirect("/home")
	}
	return ensureVersion(versionParam)
}

/**
 * For `:version?` (documentation-layout):
 * - If `params.version` is a known version -> use it
 * - Else, peek the first path segment, if it's a known version -> use it
 * - Else fall back to latest
 */
export function resolveLayoutVersion(paramsVersion: string | undefined, request: Request) {
	if (isKnownVersion(paramsVersion)) return { version: paramsVersion }
	const first = firstPathSegment(request)
	return ensureVersion(isKnownVersion(first) ? first : undefined)
}
