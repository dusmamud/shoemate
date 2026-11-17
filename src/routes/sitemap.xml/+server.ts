import { blogPosts, brandSlug, brands } from '#lib/data/content';
import { products } from '#lib/data/products';

export const prerender = true;

const BASE = 'https://shoemate.pages.dev';

const staticRoutes = [
	'',
	'/shop',
	'/categories',
	'/new-arrivals',
	'/deals',
	'/about',
	'/cart',
	'/checkout',
	'/search',
	'/signin',
	'/forgot-password',
	'/help',
	'/shipping',
	'/returns',
	'/size-guide',
	'/privacy',
	'/terms',
	'/drops',
	'/blog',
	'/fit-finder',
	'/accessibility',
	'/wishlist',
	'/account',
	'/account/orders',
	'/account/addresses',
	'/gift-cards',
	'/rewards',
	'/track',
	'/compare'
];

export function GET() {
	const urls = [
		...staticRoutes,
		...products.map((p) => `/product/${p.slug}`),
		...brands.map((b) => `/brand/${brandSlug(b)}`),
		...blogPosts.map((p) => `/blog/${p.slug}`)
	];
	const unique = [...new Set(urls)];
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique
		.map((u) => `  <url><loc>${BASE}${u === '' ? '/' : u + '/'}</loc></url>`)
		.join('\n')}\n</urlset>\n`;
	return new Response(body, { headers: { 'content-type': 'application/xml' } });
}
