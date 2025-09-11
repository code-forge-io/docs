import type { Page } from "content-collections"

export function getPageSlug(page: Page) {
	return page._meta.path === "_index" ? "/" : page.slug
}
