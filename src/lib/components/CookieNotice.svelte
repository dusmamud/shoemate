<script lang="ts">
	import { browser } from '$app/env';

	const KEY = 'shoemate:cookie-notice-dismissed';

	let visible = $state(false);

	$effect(() => {
		if (!browser) return;
		try {
			visible = localStorage.getItem(KEY) !== '1';
		} catch {
			visible = true;
		}
	});

	function dismiss() {
		try {
			localStorage.setItem(KEY, '1');
		} catch {
			// Dismissal is best-effort; the banner just hides for this visit.
		}
		visible = false;
	}
</script>

{#if visible}
	<div
		role="region"
		aria-label="Privacy notice"
		class="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-3xl bg-ink p-5 text-white shadow-2xl sm:inset-x-6 sm:bottom-6"
	>
		<p class="text-sm leading-relaxed">
			<strong>Your privacy, in plain words:</strong> Shoemate stores your cart, wishlist and sign-in only in
			this browser (localStorage). No tracking cookies, no analytics, nothing sent to a server yet.
			<a href="/privacy" class="font-semibold text-brand-400 underline hover:text-white">Read the privacy policy</a>.
		</p>
		<div class="mt-3 flex gap-2">
			<button
				type="button"
				onclick={dismiss}
				class="flex h-11 items-center rounded-full bg-brand-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
			>
				Got it
			</button>
			<a
				href="/privacy"
				class="flex h-11 items-center rounded-full bg-white/10 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
			>
				Privacy policy
			</a>
		</div>
	</div>
{/if}
