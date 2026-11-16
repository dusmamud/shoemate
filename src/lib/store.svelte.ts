import { browser } from '$app/env';
import { products } from './data/products';

export interface CartLine {
	slug: string;
	size: string;
	qty: number;
}

function readJson<T>(key: string, fallback: T): T {
	if (!browser) return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

class CartStore {
	lines = $state<CartLine[]>(readJson<CartLine[]>('shoemate:cart', []));

	count = $derived(this.lines.reduce((n, l) => n + l.qty, 0));

	subtotal = $derived(
		this.lines.reduce((sum, l) => {
			const p = products.find((x) => x.slug === l.slug);
			return sum + (p ? p.price * l.qty : 0);
		}, 0)
	);

	private save() {
		if (browser) localStorage.setItem('shoemate:cart', JSON.stringify(this.lines));
	}

	add(slug: string, size: string, qty = 1) {
		const line = this.lines.find((l) => l.slug === slug && l.size === size);
		if (line) line.qty = Math.min(line.qty + qty, 9);
		else this.lines.push({ slug, size, qty });
		this.save();
	}

	remove(slug: string, size: string) {
		this.lines = this.lines.filter((l) => !(l.slug === slug && l.size === size));
		this.save();
	}

	setQty(slug: string, size: string, qty: number) {
		const line = this.lines.find((l) => l.slug === slug && l.size === size);
		if (!line) return;
		if (qty <= 0) this.remove(slug, size);
		else {
			line.qty = Math.min(qty, 9);
			this.save();
		}
	}

	clear() {
		this.lines = [];
		this.save();
	}
}

export const cart = new CartStore();

class WishlistStore {
	slugs = $state<string[]>(readJson<string[]>('shoemate:wishlist', []));

	private save() {
		if (browser) localStorage.setItem('shoemate:wishlist', JSON.stringify(this.slugs));
	}

	has(slug: string) {
		return this.slugs.includes(slug);
	}

	toggle(slug: string) {
		this.slugs = this.has(slug) ? this.slugs.filter((s) => s !== slug) : [...this.slugs, slug];
		this.save();
	}
}

export const wishlist = new WishlistStore();

class UiStore {
	cartOpen = $state(false);
	searchOpen = $state(false);
	menuOpen = $state(false);
}

export const ui = new UiStore();
