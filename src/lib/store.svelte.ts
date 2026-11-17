import { browser } from '$app/env';
import { products } from './data/products';

export interface CartLine {
	slug: string;
	size: string;
	qty: number;
	/** Selected colour name (e.g. "Black"), stored with the line when chosen on the PDP. */
	color?: string;
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

	add(slug: string, size: string, qty = 1, color?: string) {
		const line = this.lines.find((l) => l.slug === slug && l.size === size);
		if (line) {
			line.qty = Math.min(line.qty + qty, 9);
			if (color) line.color = color;
		} else this.lines.push({ slug, size, qty, color });
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

// ---------------------------------------------------------------------------
// Orders (local/demo until the Go backend lands). B4's checkout calls
// orders.add(...) on demo order completion — keep this API exact.
// ---------------------------------------------------------------------------

export type OrderStatus = 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered';

export interface TimelineStep {
	label: string;
	date: string; // ISO — estimated date for steps not yet done
	done: boolean;
}

export interface OrderItem {
	slug: string;
	name: string;
	price: number;
	qty: number;
	size: string;
	colour?: string;
}

export interface Order {
	id: string; // SM-*
	date: string; // ISO
	items: OrderItem[];
	subtotal: number;
	shipping: number;
	discount: number;
	total: number;
	status: OrderStatus;
	timeline: TimelineStep[];
}

export interface OrderInput {
	id: string;
	date: string;
	items: OrderItem[];
	subtotal: number;
	shipping: number;
	discount: number;
	total: number;
	status?: OrderStatus;
	timeline?: TimelineStep[];
}

const ORDER_LABELS: OrderStatus[] = ['Confirmed', 'Packed', 'Shipped', 'Delivered'];

/** Demo timeline: one step per day from the order date, done up to `status`. */
export function buildTimeline(dateIso: string, status: OrderStatus): TimelineStep[] {
	const reached = ORDER_LABELS.indexOf(status);
	const base = new Date(dateIso).getTime();
	return ORDER_LABELS.map((label, i) => {
		const step = new Date(base + i * 24 * 60 * 60 * 1000);
		return { label, date: step.toISOString(), done: i <= reached };
	});
}

class OrdersStore {
	all = $state<Order[]>(readJson<Order[]>('shoemate:orders', []));

	private save() {
		if (browser) localStorage.setItem('shoemate:orders', JSON.stringify(this.all));
	}

	add(input: OrderInput): Order {
		const status = input.status ?? 'Confirmed';
		const order: Order = {
			...input,
			status,
			timeline: input.timeline ?? buildTimeline(input.date, status)
		};
		this.all = [order, ...this.all.filter((o) => o.id !== order.id)];
		this.save();
		return order;
	}

	list(): Order[] {
		return this.all;
	}

	get(id: string): Order | undefined {
		return this.all.find((o) => o.id === id);
	}
}

export const orders = new OrdersStore();

// ---------------------------------------------------------------------------
// Saved addresses (local/demo). B4's checkout reads these for address reuse.
// ---------------------------------------------------------------------------

export interface Address {
	id: string;
	label: string;
	name: string;
	street: string;
	city: string;
	zip: string;
	country: string;
	isDefault: boolean;
}

export type AddressInput = Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean };

class AddressesStore {
	all = $state<Address[]>(readJson<Address[]>('shoemate:addresses', []));

	private save() {
		if (browser) localStorage.setItem('shoemate:addresses', JSON.stringify(this.all));
	}

	list(): Address[] {
		return this.all;
	}

	get(id: string): Address | undefined {
		return this.all.find((a) => a.id === id);
	}

	getDefault(): Address | undefined {
		return this.all.find((a) => a.isDefault);
	}

	add(input: AddressInput): Address {
		const isDefault = input.isDefault ?? this.all.length === 0;
		const address: Address = {
			...input,
			id: `addr-${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`,
			isDefault
		};
		this.all = isDefault
			? [...this.all.map((a) => ({ ...a, isDefault: false })), address]
			: [...this.all, address];
		this.save();
		return address;
	}

	update(id: string, patch: Partial<AddressInput>) {
		this.all = this.all.map((a) => {
			if (a.id !== id) return patch.isDefault ? { ...a, isDefault: false } : a;
			return { ...a, ...patch };
		});
		this.save();
	}

	remove(id: string) {
		const wasDefault = this.all.find((a) => a.id === id)?.isDefault;
		this.all = this.all.filter((a) => a.id !== id);
		if (wasDefault && this.all.length) this.all = [{ ...this.all[0], isDefault: true }, ...this.all.slice(1)];
		this.save();
	}

	setDefault(id: string) {
		this.all = this.all.map((a) => ({ ...a, isDefault: a.id === id }));
		this.save();
	}
}

export const addresses = new AddressesStore();

// ---------------------------------------------------------------------------
// Demo e-gift cards. Codes are SHOE-GIFT-XXXXXX; B4's checkout redeems them
// from the same `shoemate:giftcards` key.
// ---------------------------------------------------------------------------

export interface GiftCard {
	code: string;
	amount: number;
	balance: number;
	date: string; // ISO
}

const GIFT_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function makeGiftCode(): string {
	let suffix = '';
	for (let i = 0; i < 6; i++) suffix += GIFT_ALPHABET[Math.floor(Math.random() * GIFT_ALPHABET.length)];
	return `SHOE-GIFT-${suffix}`;
}

class GiftCardsStore {
	all = $state<GiftCard[]>(readJson<GiftCard[]>('shoemate:giftcards', []));

	private save() {
		if (browser) localStorage.setItem('shoemate:giftcards', JSON.stringify(this.all));
	}

	list(): GiftCard[] {
		return this.all;
	}

	get(code: string): GiftCard | undefined {
		return this.all.find((c) => c.code === code.trim().toUpperCase());
	}

	add(amount: number): GiftCard {
		const card: GiftCard = { code: makeGiftCode(), amount, balance: amount, date: new Date().toISOString() };
		this.all = [card, ...this.all];
		this.save();
		return card;
	}
}

export const giftcards = new GiftCardsStore();

// ---------------------------------------------------------------------------
// Demo rewards: 1 point per $1 spent on local orders. No backend, no signup.
// ---------------------------------------------------------------------------

export interface RewardsSummary {
	points: number;
	tier: 'Bronze' | 'Silver' | 'Gold';
	next: { name: 'Silver' | 'Gold'; at: number } | null;
}

export function getRewards(): RewardsSummary {
	const points = orders.list().reduce((n, o) => n + Math.floor(o.total), 0);
	const tier = points >= 1500 ? 'Gold' : points >= 500 ? 'Silver' : 'Bronze';
	const next =
		tier === 'Gold' ? null : tier === 'Silver' ? { name: 'Gold' as const, at: 1500 } : { name: 'Silver' as const, at: 500 };
	return { points, tier, next };
}
