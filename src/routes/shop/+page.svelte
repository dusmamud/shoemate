<script lang="ts">
	import { page } from '$app/state';
	import { CaretDown, MagnifyingGlass, SlidersHorizontal, X } from 'phosphor-svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Reveal from '#lib/components/Reveal.svelte';
	import { products } from '#lib/data/products';

	const allBrands = [...new Set(products.map((p) => p.brand))].sort();
	const allCategories = [...new Set(products.map((p) => p.category))].sort();

	const collections: Record<string, { label: string; filter: (p: (typeof products)[number]) => boolean }> = {
		'premium-sneakers': { label: 'Premium Sneakers', filter: (p) => p.rating >= 4.8 },
		'top-picks': { label: 'Top Picks in Sneakers', filter: (p) => p.badge === 'Bestseller' },
		'selling-sneakers': { label: 'Selling Sneakers', filter: (p) => p.reviews >= 1000 },
		'sneaker-drops': { label: 'Sneaker Drops', filter: (p) => p.badge === 'New' || p.badge === 'Limited' }
	};

	let q = $state('');
	let brand = $state('all');
	let category = $state('all');
	let collection = $state('all');
	let maxPrice = $state(250);
	let sort = $state('featured');
	let filtersOpen = $state(false);

	// url.searchParams is not available during prerender — read it after mount.
	$effect(() => {
		const sp = page.url.searchParams;
		q = sp.get('q') ?? '';
		brand = sp.get('brand') ?? 'all';
		category = sp.get('category') ?? 'all';
		collection = sp.get('collection') ?? 'all';
		sort = sp.get('sort') ?? 'featured';
	});

	let filtered = $derived.by(() => {
		let list = products.filter((p) => {
			if (q.trim()) {
				const needle = q.trim().toLowerCase();
				if (
					!p.name.toLowerCase().includes(needle) &&
					!p.brand.toLowerCase().includes(needle) &&
					!p.category.toLowerCase().includes(needle)
				)
					return false;
			}
			if (brand !== 'all' && p.brand !== brand) return false;
			if (category !== 'all' && p.category !== category) return false;
			if (collection !== 'all' && !collections[collection]?.filter(p)) return false;
			if (p.price > maxPrice) return false;
			return true;
		});
		if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
		else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
		else if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
		else if (sort === 'bestsellers') list = [...list].sort((a, b) => b.reviews - a.reviews);
		return list;
	});

	let activeFilters = $derived(
		(brand !== 'all' ? 1 : 0) + (category !== 'all' ? 1 : 0) + (collection !== 'all' ? 1 : 0) + (maxPrice < 250 ? 1 : 0)
	);

	function reset() {
		q = '';
		brand = 'all';
		category = 'all';
		collection = 'all';
		maxPrice = 250;
		sort = 'featured';
	}

	const collectionLabel = $derived(collection !== 'all' ? collections[collection]?.label : null);
</script>

<svelte:head>
	<title>Shop All Sneakers — Shoemate</title>
	<meta name="description" content="Browse all premium sneakers at Shoemate. Filter by brand, category and price." />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Shop</p>
		<h1 class="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
			{collectionLabel ?? 'All Sneakers'}
		</h1>
		<p class="mt-2 max-w-xl text-[15px] text-ink-soft">
			{filtered.length} styles in stock — free shipping over $150, 30-day returns on everything.
		</p>
	</Reveal>

	<div class="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
		<!-- Filters -->
		<aside class="lg:sticky lg:top-24 lg:self-start">
			<button
				type="button"
				onclick={() => (filtersOpen = !filtersOpen)}
				class="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-white text-sm font-semibold lg:hidden"
				aria-expanded={filtersOpen}
			>
				<SlidersHorizontal size={18} /> Filters
				{#if activeFilters}<span class="rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-white">{activeFilters}</span>{/if}
			</button>

			<div class="mt-4 space-y-6 rounded-3xl bg-white p-5 shadow-card {filtersOpen ? 'block' : 'hidden lg:block'}">
				<div>
					<label for="shop-q" class="text-xs font-bold tracking-widest text-ink-soft uppercase">Search</label>
					<div class="mt-2 flex items-center gap-2 rounded-full bg-mist px-3.5">
						<MagnifyingGlass size={17} class="shrink-0 text-ink-soft" />
						<input id="shop-q" type="search" bind:value={q} placeholder="Name or brand…" class="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none" />
						{#if q}
							<button type="button" onclick={() => (q = '')} aria-label="Clear search" class="text-ink-soft hover:text-ink"><X size={16} /></button>
						{/if}
					</div>
				</div>

				<div>
					<label for="shop-collection" class="text-xs font-bold tracking-widest text-ink-soft uppercase">Collection</label>
					<select id="shop-collection" bind:value={collection} class="mt-2 h-11 w-full rounded-full border border-line bg-white px-3.5 text-sm font-medium outline-none focus:border-brand-500">
						<option value="all">All collections</option>
						{#each Object.entries(collections) as [slug, c]}
							<option value={slug}>{c.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<span class="text-xs font-bold tracking-widest text-ink-soft uppercase">Category</span>
					<div class="mt-2 flex flex-wrap gap-2">
						<button type="button" onclick={() => (category = 'all')} class="rounded-full px-3.5 py-2 text-[13px] font-medium capitalize transition-colors {category === 'all' ? 'bg-ink text-white' : 'bg-mist hover:bg-peach'}">All</button>
						{#each allCategories as c}
							<button type="button" onclick={() => (category = c)} class="rounded-full px-3.5 py-2 text-[13px] font-medium capitalize transition-colors {category === c ? 'bg-ink text-white' : 'bg-mist hover:bg-peach'}">{c}</button>
						{/each}
					</div>
				</div>

				<div>
					<span class="text-xs font-bold tracking-widest text-ink-soft uppercase">Brand</span>
					<div class="mt-2 flex flex-wrap gap-2">
						<button type="button" onclick={() => (brand = 'all')} class="rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors {brand === 'all' ? 'bg-ink text-white' : 'bg-mist hover:bg-peach'}">All</button>
						{#each allBrands as b}
							<button type="button" onclick={() => (brand = b)} class="rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors {brand === b ? 'bg-ink text-white' : 'bg-mist hover:bg-peach'}">{b}</button>
						{/each}
					</div>
				</div>

				<div>
					<label for="shop-price" class="flex justify-between text-xs font-bold tracking-widest text-ink-soft uppercase">
						Max price <span class="text-sm font-bold text-ink normal-case">${maxPrice}</span>
					</label>
					<input id="shop-price" type="range" min="80" max="250" step="10" bind:value={maxPrice} class="mt-2 w-full accent-[#ff6b1a]" />
					<div class="flex justify-between text-xs text-ink-soft"><span>$80</span><span>$250</span></div>
				</div>

				{#if activeFilters || q}
					<button type="button" onclick={reset} class="h-10 w-full rounded-full bg-mist text-sm font-semibold transition-colors hover:bg-peach">
						Clear all filters
					</button>
				{/if}
			</div>
		</aside>

		<!-- Results -->
		<div>
			<div class="flex flex-wrap items-center justify-between gap-3">
				<p class="text-sm text-ink-soft" aria-live="polite">
					Showing <strong class="text-ink">{filtered.length}</strong> of {products.length} products
				</p>
				<label class="flex items-center gap-2 text-sm font-medium">
					Sort
					<span class="relative">
						<select bind:value={sort} class="h-11 appearance-none rounded-full border border-line bg-white pr-9 pl-4 text-sm font-medium outline-none focus:border-brand-500">
							<option value="featured">Featured</option>
							<option value="bestsellers">Bestsellers</option>
							<option value="rating">Top rated</option>
							<option value="price-asc">Price: low to high</option>
							<option value="price-desc">Price: high to low</option>
						</select>
						<CaretDown size={15} class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
					</span>
				</label>
			</div>

			{#if filtered.length}
				<div class="mt-5 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
					{#each filtered as product, i}
						<Reveal delay={Math.min(i, 5) * 50}>
							<ProductCard {product} />
						</Reveal>
					{/each}
				</div>
			{:else}
				<div class="mt-5 rounded-3xl bg-white p-10 text-center shadow-card">
					<p class="text-lg font-bold">No sneakers match those filters</p>
					<p class="mt-1 text-sm text-ink-soft">Try a different brand, category or price range.</p>
					<button type="button" onclick={reset} class="mt-5 h-11 rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-brand-500">
						Clear all filters
					</button>
				</div>
			{/if}
		</div>
	</div>
</section>
