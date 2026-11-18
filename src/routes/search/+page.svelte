<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import { page } from '$app/state';
	import { MagnifyingGlass, X } from 'phosphor-svelte';
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
	<Seo
		title={q ? `Search: ${q} — Shoemate` : 'Search — Shoemate'}
		description="Search premium sneakers at Shoemate — find your pair by brand, style or size."
		noindex
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Search' }])} />

<section class="pt-8">
	<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Search</p>
	<h1 class="mt-1 text-3xl font-extrabold tracking-tight break-words sm:text-4xl">
		{#if q}Results for “{q}”{:else}Search sneakers{/if}
	</h1>

	<form method="get" action="/search" role="search" class="mt-5 flex max-w-2xl gap-2">
		<div class="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-white px-4 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/50">
			<MagnifyingGlass size={20} class="shrink-0 text-ink-soft" />
			<label class="sr-only" for="search-q">Search sneakers</label>
			<input
				id="search-q"
				name="q"
				type="search"
				value={q}
				placeholder="Search by name, brand or category…"
				autocomplete="off"
				class="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink-soft/60"
			/>
			{#if q}
				<a
					href="/search"
					aria-label="Clear search"
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mist hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-500"
				>
					<X size={17} />
				</a>
			{/if}
		</div>
		<button
			type="submit"
			class="h-12 shrink-0 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
		>
			Search
		</button>
	</form>

	{#if q}
		<p class="mt-4 text-[15px] text-ink-soft" aria-live="polite">{results.length} match{results.length === 1 ? '' : 'es'} found.</p>
		{#if results.length}
			<div class="mt-6 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
				{#each results as product}
					<ProductCard {product} morph />
				{/each}
			</div>
		{:else}
			<div class="mt-6 rounded-3xl bg-white p-6 text-center shadow-card sm:p-10">
				<p class="text-lg font-bold">Nothing matched “{q}”</p>
				<p class="mt-1 text-sm text-ink-soft">Try a brand like Nike or Jordan, or a style like running.</p>
				<a href="/shop" class="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
					Browse all sneakers
				</a>
			</div>
		{/if}
	{:else}
		<p class="mt-4 max-w-lg text-[15px] text-ink-soft">Type a name, brand or category above — or browse the full collection.</p>
		<a href="/shop" class="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
			Browse all sneakers
		</a>
	{/if}
</section>
