<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		delay = 0,
		class: cls = ''
	}: { children: Snippet; delay?: number; class?: string } = $props();

	let el: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!el) return;
		// No observer (old browser / failed JS): stay visible, never hide.
		if (!('IntersectionObserver' in window)) {
			el.classList.add('is-visible');
			return;
		}
		// Already (almost) in view on load: show immediately.
		if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
			el.classList.add('is-visible');
			return;
		}
		// Below the fold: arm the hidden state, reveal on scroll-in.
		el.classList.add('reveal-armed');
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						io.disconnect();
					}
				}
			},
			{ threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
		);
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<div bind:this={el} class="reveal h-full {cls}" style="transition-delay: {delay}ms">
	{@render children()}
</div>
