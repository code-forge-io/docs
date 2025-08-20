import { href, useParams } from "react-router"
import { versions } from "./versions"

export type Version = (typeof versions)[number]

export const getLatestVersion = () => versions[0]

export function isKnownVersion(v: string | undefined): v is Version {
	return !!v && (versions as readonly string[]).includes(v)
}

export function useCurrentVersion() {
	const { version } = useParams<"version">()
	return isKnownVersion(version) ? version : getLatestVersion()
}

export const hrefForHomepage = (v: string) =>
	v === getLatestVersion() ? href("/:version?/home") : href("/:version?/home", { version: v })
