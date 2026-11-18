<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList, collectionPage } from '#lib/jsonld';
	import { browser } from '$app/env';
	import { page } from '$app/state';
	import { CaretDown, MagnifyingGlass, SlidersHorizontal, X } from 'phosphor-svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Reveal from '#lib/components/Reveal.svelte';
	import Skeleton from '#lib/components/Skeleton.svelte';
	import { products, SIZES, type Product } from '#lib/data/products';

	const allBrands = [...new Set(products.map((p) => p.brand))].sort();
	const allCategories = [...new Set(products.map((p) => p.category))].sort();

	const collections: Record<string, { label: string; filter: (p: (typeof products)[number]) => boolean }> = {
		'premium-sneakers': { label: 'Premium Sneakers', filter: (p) => p.rating >= 4.8 },
		'top-picks': { label: 'Top Picks in Sneakers', filter: (p) => p.badge === 'Bestseller' },
		'selling-sneakers': { label: 'Selling Sneakers', filter: (p) => p.reviews >= 1000 },
		'sneaker-drops': { label: 'Sneaker Drops', filter: (p) => p.badge === 'New' || p.badge === 'Limited' }
	};

	/**
	 * Per-size stock. Reads real per-size data when it exists — B1's shape is
	 * `product.sizeStock: { size, stock }[]` (demo numbers, sum equals `stock`).
	 * Also accepts a Record<string, number> shape, otherwise falls back to
	 * the single per-product stock number: a size is in stock while the
	 * product has any stock at all.
	 */
	type SizeStockLike = { size: string; stock: number };
	type ProductWithSizeStock = Product & {
		sizeStock?: SizeStockLike[] | Record<string, number>;
		stockBySize?: SizeStockLike[] | Record<string, number>;
	};
	function sizeInStock(p: Product, size: string): boolean {
		const perSize = (p as ProductWithSizeStock).sizeStock ?? (p as ProductWithSizeStock).stockBySize;
		if (Array.isArray(perSize)) {
			const entry = perSize.find((e) => e.size === size);
			return entry ? entry.stock > 0 : false;
		}
		if (perSize) return (perSize[size] ?? 0) > 0;
		return p.stock > 0 && p.sizes.includes(size);
	}
	// A size button is disabled only when no product has that size in stock.
	function sizeAvailable(size: string): boolean {
		return products.some((p) => sizeInStock(p, size));
	}

	let q = $state('');
	let brand = $state('all');
	let category = $state('all');
	let collection = $state('all');
	let maxPrice = $state(250);
	let sort = $state('featured');
	let size = $state('all');
	let inStockOnly = $state(false);
	let filtersOpen = $state(false);
	let filtering = $state(false);

	// url.searchParams is not available during prerender — read it after mount.
	$effect(() => {
		const sp = page.url.searchParams;
		q = sp.get('q') ?? '';
		brand = sp.get('brand') ?? 'all';
		category = sp.get('category') ?? 'all';
		collection = sp.get('collection') ?? 'all';
		sort = sp.get('sort') ?? 'featured';
		size = sp.get('size') ?? 'all';
		inStockOnly = sp.get('instock') === '1';
		maxPrice = Number(sp.get('maxprice') ?? 250) || 250;
	});

	// Keep filters + sort in the URL (replaceState — no navigation, no reload).
	$effect(() => {
		if (!browser) return;
		const sp = new URLSearchParams();
		if (q.trim()) sp.set('q', q.trim());
		if (brand !== 'all') sp.set('brand', brand);
		if (category !== 'all') sp.set('category', category);
		if (collection !== 'all') sp.set('collection', collection);
		if (sort !== 'featured') sp.set('sort', sort);
		if (size !== 'all') sp.set('size', size);
		if (inStockOnly) sp.set('instock', '1');
		if (maxPrice < 250) sp.set('maxprice', String(maxPrice));
		const query = sp.toString();
		const next = query ? `${page.url.pathname}?${query}` : page.url.pathname;
		if (next !== page.url.pathname + page.url.search) {
			history.replaceState(null, '', next);
		}
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
			if (inStockOnly && p.stock <= 0) return false;
			if (size !== 'all' && !sizeInStock(p, size)) return false;
			return true;
		});
		if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
		else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
		else if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
		else if (sort === 'bestsellers') list = [...list].sort((a, b) => b.reviews - a.reviews);
		else if (sort === 'newest')
			list = [...list].sort((a, b) => Number(b.badge === 'New') - Number(a.badge === 'New'));
		else if (sort === 'discount')
			list = [...list].sort((a, b) => (b.oldPrice ?? b.price) - b.price - ((a.oldPrice ?? a.price) - a.price));
		return list;
	});

	let activeFilters = $derived(
		(brand !== 'all' ? 1 : 0) +
			(category !== 'all' ? 1 : 0) +
			(collection !== 'all' ? 1 : 0) +
			(maxPrice < 250 ? 1 : 0) +
			(size !== 'all' ? 1 : 0) +
			(inStockOnly ? 1 : 0)
	);

	// Applied-filters overview chips (M-17).
	interface Chip {
		label: string;
		clear: () => void;
	}
	let chips = $derived.by((): Chip[] => {
		const out: Chip[] = [];
		if (q.trim()) out.push({ label: `“${q.trim()}”`, clear: () => (q = '') });
		if (brand !== 'all') out.push({ label: brand, clear: () => (brand = 'all') });
		if (category !== 'all') out.push({ label: category, clear: () => (category = 'all') });
		if (collection !== 'all')
			out.push({ label: collections[collection]?.label ?? collection, clear: () => (collection = 'all') });
		if (size !== 'all') out.push({ label: `Size ${size}`, clear: () => (size = 'all') });
		if (inStockOnly) out.push({ label: 'In stock only', clear: () => (inStockOnly = false) });
		if (maxPrice < 250) out.push({ label: `Up to $${maxPrice}`, clear: () => (maxPrice = 250) });
		return out;
	});

	function reset() {
		q = '';
		brand = 'all';
		category = 'all';
		collection = 'all';
		maxPrice = 250;
		sort = 'featured';
		size = 'all';
		inStockOnly = false;
	}

	// Brief skeleton while the grid re-filters (N-09). Local data is instant,
	// so this is a short visual beat, not a wait for a network round-trip.
	let filterKey = $derived([q, brand, category, collection, maxPrice, sort, size, inStockOnly].join('|'));
	let firstRun = true;
	let filterTimer: ReturnType<typeof setTimeout> | undefined;
	$effect(() => {
		void filterKey;
		if (firstRun) {
			firstRun = false;
			return;
		}
		filtering = true;
		clearTimeout(filterTimer);
		filterTimer = setTimeout(() => (filtering = false), 280);
		return () => clearTimeout(filterTimer);
	});

	const collectionLabel = $derived(collection !== 'all' ? collections[collection]?.label : null);
</script>

<svelte:head>
	<Seo
		title="Shop All Sneakers — Shoemate"
		description="Browse all premium sneakers at Shoemate. Filter by brand, category, size and price."
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Shop' }])} />
<!-- ItemList = the products in the prerendered (unfiltered) list. -->
<JsonLd
		data={collectionPage(
			'Shop All Sneakers',
			'/shop/',
			products.map((p) => ({ name: p.name, href: `/product/${p.slug}/` }))
		)}
	/>

<section class="pt-8">
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
		<aside class="min-w-0 lg:sticky lg:top-24 lg:self-start">
			<button
				type="button"
				onclick={() => (filtersOpen = !filtersOpen)}
				class="sticky top-[72px] z-20 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line bg-white text-sm font-semibold shadow-md focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:top-20 lg:hidden"
				aria-expanded={filtersOpen}
				aria-controls="shop-filters"
			>
				<SlidersHorizontal size={18} /> Filters
				{#if activeFilters}<span class="rounded-full bg-brand-500 px-2 py-0.5 text-xs font-bold text-white">{activeFilters}</span>{/if}
			</button>

			<div id="shop-filters" class="mt-4 space-y-6 rounded-3xl bg-white p-5 shadow-card {filtersOpen ? 'block' : 'hidden lg:block'}">
				<div class="flex items-center justify-between lg:hidden">
					<span class="text-sm font-bold">Filters</span>
					<button
						type="button"
						onclick={() => (filtersOpen = false)}
						aria-label="Close filters"
						class="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mist hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-500"
					>
						<X size={20} />
					</button>
				</div>
				<div>
					<label for="shop-q" class="text-xs font-bold tracking-widest text-ink-soft uppercase">Search</label>
					<div class="mt-2 flex h-12 items-center gap-2 rounded-full bg-mist px-3.5 focus-within:ring-2 focus-within:ring-brand-500">
						<MagnifyingGlass size={18} class="shrink-0 text-ink-soft" />
						<input id="shop-q" type="search" bind:value={q} placeholder="Name or brand…" class="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink-soft/60" />
						{#if q}
							<button type="button" onclick={() => (q = '')} aria-label="Clear search" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-white hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-500"><X size={17} /></button>
						{/if}
					</div>
				</div>

				<div>
					<label for="shop-collection" class="text-xs font-bold tracking-widest text-ink-soft uppercase">Collection</label>
					<select id="shop-collection" bind:value={collection} class="mt-2 h-11 w-full rounded-full border border-line bg-white px-3.5 text-base font-medium outline-none focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500">
						<option value="all">All collections</option>
						{#each Object.entries(collections) as [slug, c]}
							<option value={slug}>{c.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<span class="text-xs font-bold tracking-widest text-ink-soft uppercase">Category</span>
					<div class="mt-2 flex flex-wrap gap-2">
						<button type="button" onclick={() => (category = 'all')} aria-pressed={category === 'all'} class="min-h-11 rounded-full px-4 text-sm font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white {category === 'all' ? 'bg-ink text-white' : 'bg-mist hover:bg-peach'}">All</button>
						{#each allCategories as c}
							<button type="button" onclick={() => (category = c)} aria-pressed={category === c} class="min-h-11 rounded-full px-4 text-sm font-medium capitalize transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white {category === c ? 'bg-ink text-white' : 'bg-mist hover:bg-peach'}">{c}</button>
						{/each}
					</div>
				</div>

				<div>
					<span class="text-xs font-bold tracking-widest text-ink-soft uppercase">Brand</span>
					<div class="mt-2 flex flex-wrap gap-2">
						<button type="button" onclick={() => (brand = 'all')} aria-pressed={brand === 'all'} class="min-h-11 rounded-full px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white {brand === 'all' ? 'bg-ink text-white' : 'bg-mist hover:bg-peach'}">All</button>
						{#each allBrands as b}
							<button type="button" onclick={() => (brand = b)} aria-pressed={brand === b} class="min-h-11 rounded-full px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white {brand === b ? 'bg-ink text-white' : 'bg-mist hover:bg-peach'}">{b}</button>
						{/each}
					</div>
				</div>

				<!-- Size filter (M-16): sizes with no stock anywhere are disabled. -->
				<div>
					<span class="text-xs font-bold tracking-widest text-ink-soft uppercase">Size</span>
					<div class="mt-2 flex flex-wrap gap-2">
						<button type="button" onclick={() => (size = 'all')} aria-pressed={size === 'all'} class="min-h-11 rounded-full px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white {size === 'all' ? 'bg-ink text-white' : 'bg-mist hover:bg-peach'}">All sizes</button>
						{#each SIZES as s}
							{@const available = sizeAvailable(s)}
							<button
								type="button"
								onclick={() => (size = s)}
								disabled={!available}
								aria-pressed={size === s}
								title={available ? undefined : `${s} is out of stock`}
								class="min-h-11 rounded-full px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white {size === s
									? 'bg-ink text-white'
									: available
										? 'bg-mist hover:bg-peach'
										: 'cursor-not-allowed bg-mist text-ink-soft/50 line-through'}"
							>
								{s}
							</button>
						{/each}
					</div>
				</div>

				<!-- In-stock toggle (M-16) -->
				<div>
					<button
						type="button"
						role="switch"
						aria-checked={inStockOnly}
						onclick={() => (inStockOnly = !inStockOnly)}
						class="flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl bg-mist px-4 py-2 text-left text-sm font-semibold transition-colors hover:bg-peach focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
					>
						<span>In stock only</span>
						<span class="relative h-6 w-11 shrink-0 rounded-full transition-colors {inStockOnly ? 'bg-brand-500' : 'bg-line'}" aria-hidden="true">
							<span class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform {inStockOnly ? 'translate-x-5' : ''}"></span>
						</span>
					</button>
				</div>

				<div>
					<label for="shop-price" class="flex items-baseline justify-between text-xs font-bold tracking-widest text-ink-soft uppercase">
						Max price <span class="text-base font-bold text-ink normal-case">${maxPrice}</span>
					</label>
					<input
						id="shop-price"
						type="range"
						min="80"
						max="250"
						step="10"
						bind:value={maxPrice}
						style="--fill: {((maxPrice - 80) / 170) * 100}%"
						aria-describedby="shop-price-range"
						class="price-range mt-1 w-full"
					/>
					<div id="shop-price-range" class="mt-1 flex justify-between text-xs font-medium text-ink-soft"><span>$80</span><span>$250</span></div>
				</div>

				{#if activeFilters || q}
					<button type="button" onclick={reset} class="h-11 w-full rounded-full bg-mist text-sm font-semibold transition-colors hover:bg-peach focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
						Clear all filters
					</button>
				{/if}

				<button
					type="button"
					onclick={() => (filtersOpen = false)}
					class="h-12 w-full rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:hidden"
				>
					Show {filtered.length} result{filtered.length === 1 ? '' : 's'}
				</button>
			</div>
		</aside>

		<!-- Results -->
		<div class="min-w-0">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<p class="text-sm text-ink-soft" aria-live="polite">
					Showing <strong class="text-ink">{filtered.length}</strong> of {products.length} products
				</p>
				<label class="flex items-center gap-2 text-sm font-medium">
					Sort
					<span class="relative">
						<select bind:value={sort} aria-label="Sort products" class="h-11 appearance-none rounded-full border border-line bg-white pr-9 pl-4 text-base font-medium outline-none focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500">
							<option value="featured">Featured</option>
							<option value="bestsellers">Bestsellers</option>
							<option value="rating">Top rated</option>
							<option value="newest">Newest</option>
							<option value="discount">Biggest discount</option>
							<option value="price-asc">Price: low to high</option>
							<option value="price-desc">Price: high to low</option>
						</select>
						<CaretDown size={15} class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
					</span>
				</label>
			</div>

			<!-- Applied-filters overview (M-17) -->
			{#if chips.length}
				<div class="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
					{#each chips as chip}
						<button
							type="button"
							onclick={chip.clear}
							class="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ink px-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
							aria-label="Remove filter {chip.label}"
						>
							{chip.label} <X size={14} weight="bold" />
						</button>
					{/each}
					<button
						type="button"
						onclick={reset}
						class="inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500"
					>
						Clear all
					</button>
				</div>
			{/if}

			{#if filtering}
				<div class="mt-5 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-5 xl:grid-cols-3" aria-hidden="true">
					{#each Array(6) as _, i (i)}
						<div class="rounded-3xl bg-white p-4 shadow-card">
							<Skeleton class="aspect-square w-full" label="Loading product" />
							<Skeleton class="mt-3 h-5 w-3/4" label="Loading product" />
							<Skeleton class="mt-2 h-5 w-1/3" label="Loading product" />
						</div>
					{/each}
				</div>
			{:else if filtered.length}
				<div class="mt-5 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-5 xl:grid-cols-3">
					{#each filtered as product, i}
						<Reveal delay={Math.min(i, 5) * 50}>
							<ProductCard {product} morph />
						</Reveal>
					{/each}
				</div>
			{:else}
				<div class="mt-5 rounded-3xl bg-white p-6 text-center shadow-card sm:p-10">
					<p class="text-lg font-bold">No sneakers match those filters</p>
					<p class="mt-1 text-sm text-ink-soft">Try a different brand, category, size or price range.</p>
					<button type="button" onclick={reset} class="mt-5 h-11 rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
						Clear all filters
					</button>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	/* Custom price slider: 28px thumb, brand-filled track (WebKit + Firefox). */
	.price-range {
		-webkit-appearance: none;
		appearance: none;
		height: 44px;
		background: transparent;
		cursor: pointer;
	}
	.price-range::-webkit-slider-runnable-track {
		height: 8px;
		border-radius: 9999px;
		background: linear-gradient(
			to right,
			#ff6b1a 0%,
			#ff6b1a var(--fill, 100%),
			#ece7e2 var(--fill, 100%),
			#ece7e2 100%
		);
	}
	.price-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		box-sizing: border-box;
		width: 28px;
		height: 28px;
		margin-top: -10px;
		border-radius: 9999px;
		background: #fff;
		border: 3px solid #ff6b1a;
		box-shadow: 0 2px 8px rgb(22 19 15 / 0.25);
	}
	.price-range::-moz-range-track {
		height: 8px;
		border-radius: 9999px;
		background: #ece7e2;
	}
	.price-range::-moz-range-progress {
		height: 8px;
		border-radius: 9999px;
		background: #ff6b1a;
	}
	.price-range::-moz-range-thumb {
		box-sizing: border-box;
		width: 28px;
		height: 28px;
		border-radius: 9999px;
		background: #fff;
		border: 3px solid #ff6b1a;
		box-shadow: 0 2px 8px rgb(22 19 15 / 0.25);
	}
	.price-range:focus-visible::-webkit-slider-thumb {
		outline: 2px solid #ff6b1a;
		outline-offset: 2px;
	}
	.price-range:focus-visible::-moz-range-thumb {
		outline: 2px solid #ff6b1a;
		outline-offset: 2px;
	}
</style>
