/**
 * Tiny toast store — success / info / error messages that auto-dismiss.
 * Mounted once by <Toast/> (another agent mounts it in +layout.svelte).
 * Toasts are also announced via role="status" in the component.
 */

export type ToastKind = 'success' | 'info' | 'error';

export interface ToastItem {
	id: number;
	kind: ToastKind;
	message: string;
}

const DEFAULT_MS = 3500;

class ToastStore {
	items = $state<ToastItem[]>([]);
	private nextId = 1;
	private timers = new Map<number, ReturnType<typeof setTimeout>>();

	push(kind: ToastKind, message: string, ms = DEFAULT_MS) {
		const id = this.nextId++;
		this.items = [...this.items, { id, kind, message }];
		this.timers.set(
			id,
			setTimeout(() => this.dismiss(id), ms)
		);
		return id;
	}

	success(message: string, ms = DEFAULT_MS) {
		return this.push('success', message, ms);
	}

	info(message: string, ms = DEFAULT_MS) {
		return this.push('info', message, ms);
	}

	error(message: string, ms = DEFAULT_MS) {
		return this.push('error', message, ms);
	}

	dismiss(id: number) {
		const timer = this.timers.get(id);
		if (timer) clearTimeout(timer);
		this.timers.delete(id);
		this.items = this.items.filter((t) => t.id !== id);
	}
}

export const toast = new ToastStore();
