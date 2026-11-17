import { browser } from '$app/env';

const KEY = 'shoemate:compare';
export const COMPARE_MAX = 3;

function readSlugs(): string[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(KEY);
		const parsed = raw ? (JSON.parse(raw) as unknown) : [];
		return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === 'string') : [];
	} catch {
		return [];
	}
}

export type CompareToggleResult = 'added' | 'removed' | 'full';

class CompareStore {
	slugs = $state<string[]>(readSlugs());

	private save() {
		if (browser) localStorage.setItem(KEY, JSON.stringify(this.slugs));
	}

	has(slug: string) {
		return this.slugs.includes(slug);
	}

	/** Adds or removes a slug. Returns 'full' when already at COMPARE_MAX. */
	toggle(slug: string): CompareToggleResult {
		if (this.has(slug)) {
			this.slugs = this.slugs.filter((s) => s !== slug);
			this.save();
			return 'removed';
		}
		if (this.slugs.length >= COMPARE_MAX) return 'full';
		this.slugs = [...this.slugs, slug];
		this.save();
		return 'added';
	}

	remove(slug: string) {
		this.slugs = this.slugs.filter((s) => s !== slug);
		this.save();
	}

	clear() {
		this.slugs = [];
		this.save();
	}
}

export const compare = new CompareStore();
