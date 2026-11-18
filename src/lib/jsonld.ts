/**
 * JSON-LD helpers (Wave C — structured data).
 *
 * Every helper returns a plain object that `<JsonLd>` renders as a
 * `<script type="application/ld+json">` block. URLs are absolute with a
 * trailing slash, matching the site's `trailingSlash: 'always'` routing.
 * Nothing here is visible on the page — JSON-LD only.
 */

export const SITE = 'https://shoemate.pages.dev';

export interface Crumb {
	/** Display name, e.g. 'Shop'. */
	name: string;
	/**
	 * Absolute path WITH trailing slash, e.g. '/shop/'.
	 * Omit on the last (current-page) crumb — its `item` is then left out.
	 */
	href?: string;
}

/**
 * BreadcrumbList for a page trail. Home is always first; the last crumb is
 * the current page and carries no `item` (Google treats it as the page
 * itself). A one-crumb trail (Home) keeps its `item` so the block is not
 * just a bare name.
 */
export function breadcrumbList(crumbs: Crumb[]): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			...(c.href ? { item: `${SITE}${c.href}` } : {})
		}))
	};
}

export interface ListEntry {
	/** Display name of the listed item. */
	name: string;
	/** Absolute path WITH trailing slash, e.g. '/product/nike-air-max-dn/'. */
	href: string;
}

/**
 * CollectionPage whose mainEntity is an ItemList of the items actually
 * rendered on the page (products on Shop/Brand, categories on Categories,
 * posts on the blog index). One script block, ItemList nested — the
 * standard CollectionPage pattern.
 */
export function collectionPage(
	name: string,
	path: string,
	entries: ListEntry[]
): Record<string, unknown> {
	return {
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name,
		url: `${SITE}${path}`,
		mainEntity: {
			'@type': 'ItemList',
			itemListElement: entries.map((e, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: e.name,
				url: `${SITE}${e.href}`
			}))
		}
	};
}
