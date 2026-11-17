import { brandSlug, brands } from '#lib/data/content';

export function entries() {
	return brands.map((b) => ({ slug: brandSlug(b) }));
}
