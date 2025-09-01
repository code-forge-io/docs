import { href, useParams } from "react-router"
import { versions } from "./versions"

export type Version = (typeof versions)[number]

export const getLatestVersion = () => versions[0]

export const isKnownVersion = (v: string | undefined): v is Version =>
	typeof v === "string" && versions.includes(v as Version)

export const resolveVersion = (param?: string) => {
	if (!param) return getLatestVersion()
	return isKnownVersion(param) ? param : getLatestVersion()
}

export function useCurrentVersion() {
	const { version } = useParams<"version">()
	return resolveVersion(version) ?? getLatestVersion()
}

export const hrefForHomepage = (v: string) =>
	v === getLatestVersion() ? href("/:version?/home") : href("/:version?/home", { version: v })
