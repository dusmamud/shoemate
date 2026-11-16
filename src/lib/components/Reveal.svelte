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

<div bind:this={el} class="reveal {cls}" style="transition-delay: {delay}ms">
	{@render children()}
</div>
