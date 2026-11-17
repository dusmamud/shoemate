/**
 * Focus-trap Svelte action for modal dialogs (CartDrawer, SearchOverlay).
 * Usage: <div use:focusTrap role="dialog" aria-modal="true">…</div>
 * Traps Tab / Shift+Tab inside the node while it is mounted. Escape and
 * backdrop dismissal stay with the component; returning focus to the
 * trigger on close is the component's job (it records document.activeElement
 * when the dialog opens).
 */

export function focusTrap(node: HTMLElement) {
	function onKeydown(e: KeyboardEvent) {
		if (e.key !== 'Tab') return;
		const focusable = [...node.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
		)].filter((el) => el.offsetParent !== null);
		if (focusable.length === 0) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	}

	node.addEventListener('keydown', onKeydown);
	return {
		destroy() {
			node.removeEventListener('keydown', onKeydown);
		}
	};
}
