<script lang="ts">
	import { onMount } from 'svelte';
	import ProductCard from './ProductCard.svelte';
	import { getRecent } from '#lib/recently-viewed';
	import { getProduct, type Product } from '#lib/data/products';

	// Read on mount only: localStorage does not exist during prerender, and
	// the rail must render nothing (not an empty shell) when there is no history.
	let slugs = $state<string[]>([]);
	onMount(() => {
		slugs = getRecent();
	});

	let items = $derived(
		slugs.map((s) => getProduct(s)).filter((p): p is Product => p !== undefined)
	);
</script>

{#if items.length}
	<section aria-labelledby="recently-viewed-heading" class="mt-14 sm:mt-20">
		<div class="flex items-end justify-between gap-4">
			<h2 id="recently-viewed-heading" class="text-2xl font-extrabold tracking-tight sm:text-3xl">
				Recently viewed
			</h2>
			<p class="hidden text-sm text-ink-soft sm:block">Picked up where you left off.</p>
		</div>
		<div class="nice-scroll -mx-4 mt-5 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
			{#each items as p (p.slug)}
				<div class="w-[240px] shrink-0 sm:w-[280px]">
					<ProductCard product={p} />
				</div>
			{/each}
		</div>
	</section>
{/if}
