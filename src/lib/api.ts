import { getProduct, products, type Product } from './data/products';

/**
 * API seam for the Shoemate storefront.
 *
 * Client-side only for now: the catalogue lives in `data/products.ts`.
 * When the Go backend lands, set `VITE_API_BASE` (e.g. https://api.shoemate.example)
 * and these functions will fetch from the real REST API instead — no page
 * code needs to change, because every page talks to this module only.
 */
const API_BASE = import.meta.env.VITE_API_BASE as string | undefined;

async function fetchJson<T>(path: string): Promise<T> {
	const res = await fetch(`${API_BASE}${path}`);
	if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
	return res.json() as Promise<T>;
}

export async function listProducts(): Promise<Product[]> {
	if (API_BASE) return fetchJson<Product[]>('/products');
	return products;
}

export async function fetchProduct(slug: string): Promise<Product | undefined> {
	if (API_BASE) {
		try {
			return await fetchJson<Product>(`/products/${slug}`);
		} catch {
			return undefined;
		}
	}
	return getProduct(slug);
}

export function searchProducts(query: string): Product[] {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	return products.filter(
		(p) =>
			p.name.toLowerCase().includes(q) ||
			p.brand.toLowerCase().includes(q) ||
			p.category.toLowerCase().includes(q)
	);
}
