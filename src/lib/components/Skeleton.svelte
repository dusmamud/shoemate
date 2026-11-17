<script lang="ts">
	// Skeleton placeholder block. Opacity-only pulse (no layout shift, no
	// transform) so it is safe under prefers-reduced-motion.
	let { class: cls = '', label = 'Loading…' }: { class?: string; label?: string } = $props();
</script>

<div role="status" aria-label={label} class="skeleton-pulse rounded-2xl bg-mist {cls}">
	<span class="sr-only">{label}</span>
</div>
