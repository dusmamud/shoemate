import { blogPosts } from '#lib/data/content';

export function entries() {
	return blogPosts.map((p) => ({ slug: p.slug }));
}
