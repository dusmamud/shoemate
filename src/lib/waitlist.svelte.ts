import { browser } from '$app/env';

export interface WaitlistEntry {
	slug: string;
	size: string;
	email: string;
	addedAt: string;
}

const KEY = 'shoemate:waitlist';

function readJson<T>(key: string, fallback: T): T {
	if (!browser) return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

/**
 * Back-in-stock waitlist. Demo only: entries are stored in this browser's
 * localStorage and NO email is ever sent (there is no backend yet).
 */
class WaitlistStore {
	entries = $state<WaitlistEntry[]>(readJson<WaitlistEntry[]>(KEY, []));

	private save() {
		if (browser) localStorage.setItem(KEY, JSON.stringify(this.entries));
	}

	has(slug: string, size: string, email: string): boolean {
		return this.entries.some((e) => e.slug === slug && e.size === size && e.email === email);
	}

	add(slug: string, size: string, email: string) {
		if (this.has(slug, size, email)) return;
		this.entries = [...this.entries, { slug, size, email, addedAt: new Date().toISOString() }];
		this.save();
	}
}

export const waitlist = new WaitlistStore();
