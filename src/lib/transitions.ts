import { onNavigate } from '$app/navigation';

/**
 * Page transitions via the View Transitions API.
 *
 * Call at the TOP LEVEL of the +layout.svelte script (during component
 * initialisation — onNavigate cannot be called inside $effect):
 *
 *   import { setupViewTransitions } from '#lib/transitions';
 *   setupViewTransitions();
 *
 * Safeguards:
 * - No-op when the browser has no View Transitions API.
 * - Skipped entirely under prefers-reduced-motion.
 * - Never blocks input: the navigation promise resolves as soon as the
 *   transition snapshot starts; the new page renders underneath it.
 * - Any failure falls through to a normal navigation (try/catch around
 *   startViewTransition; the promise is never left pending).
 */
export function setupViewTransitions(): () => void {
	if (typeof document === 'undefined') return () => {};
	if (!('startViewTransition' in document)) return () => {};

	onNavigate((navigation) => {
		if (!navigation.to) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		return new Promise<void>((resolve) => {
			try {
				(document as Document & { startViewTransition: (cb: () => Promise<void>) => void }).startViewTransition(
					async () => {
						resolve();
						await navigation.complete;
					}
				);
			} catch {
				resolve();
			}
		});
	});

	return () => {};
}
