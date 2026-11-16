<script lang="ts">
	import { page } from '$app/state';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import { searchProducts } from '#lib/api';

	let q = $state('');
	$effect(() => {
		// url.searchParams is not available during prerender — read it after mount.
		q = page.url.searchParams.get('q') ?? '';
	});
	const results = $derived(searchProducts(q));
</script>

<svelte:head>
	<title>{q ? `Search: ${q}` : 'Search'} — Shoemate</title>
</svelte:head>

<section class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
	<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Search</p>
	<h1 class="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
		{#if q}Results for “{q}”{:else}Search sneakers{/if}
	</h1>
	{#if q}
		<p class="mt-2 text-[15px] text-ink-soft">{results.length} match{results.length === 1 ? '' : 'es'} found.</p>
		{#if results.length}
			<div class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
				{#each results as product}
					<ProductCard {product} />
				{/each}
			</div>
		{:else}
			<div class="mt-6 rounded-3xl bg-white p-10 text-center shadow-card">
				<p class="text-lg font-bold">Nothing matched “{q}”</p>
				<p class="mt-1 text-sm text-ink-soft">Try a brand like Nike or Jordan, or a style like running.</p>
				<a href="/shop" class="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-brand-500">
					Browse all sneakers
				</a>
			</div>
		{/if}
	{:else}
		<p class="mt-2 max-w-lg text-[15px] text-ink-soft">Use the search button in the header to find sneakers by name, brand or category.</p>
		<a href="/shop" class="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-brand-500">
			Browse all sneakers
		</a>
	{/if}
</section>
