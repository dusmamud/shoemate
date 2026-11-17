import { browser } from '$app/env';

const KEY = 'shoemate:recently-viewed';
const MAX = 8;

/** Record a product view — most recent first, max 8, no duplicates. */
export function recordView(slug: string): void {
	if (!browser) return;
	try {
		const raw = localStorage.getItem(KEY);
		const list: string[] = raw ? (JSON.parse(raw) as string[]) : [];
		const next = [slug, ...list.filter((s) => s !== slug)].slice(0, MAX);
		localStorage.setItem(KEY, JSON.stringify(next));
	} catch {
		// localStorage unavailable — recently viewed is best-effort only.
	}
}

/** Slugs of recently viewed products, most recent first. Empty on the server. */
export function getRecent(): string[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? (JSON.parse(raw) as string[]) : [];
	} catch {
		return [];
	}
}
