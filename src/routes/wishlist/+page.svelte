<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import { ArrowRight, Check, Heart, ShoppingBag, Trash } from 'phosphor-svelte';
	import { cart, wishlist } from '#lib/store.svelte';
	import { getProduct, SIZES, type Product } from '#lib/data/products';
	import { responsiveImage } from '#lib/images';

	let movedName = $state('');
	// One size choice per saved item. The default is the FIRST IN-STOCK size
	// (F-03): defaulting to UK 9 put an out-of-stock size in the cart when
	// UK 9 had 0 stock, and the select offered OOS sizes as if buyable.
	let chosenSize = $state<Record<string, string>>({});

	let saved = $derived(
		wishlist.slugs.map((s) => getProduct(s)).filter((p): p is Product => p !== undefined)
	);

	function stockOf(p: Product, size: string): number {
		return p.sizeStock.find((s) => s.size === size)?.stock ?? 0;
	}

	function firstInStockSize(p: Product): string | null {
		return p.sizeStock.find((s) => s.stock > 0)?.size ?? null;
	}

	function sizeFor(p: Product): string {
		return chosenSize[p.slug] ?? firstInStockSize(p) ?? 'UK 9';
	}

	function moveToCart(p: Product) {
		// Never add an out-of-stock size: if the chosen size is gone, fall
		// back to the first in-stock size; if nothing is in stock, do nothing
		// (the button is disabled in that case anyway).
		let size = sizeFor(p);
		if (stockOf(p, size) <= 0) size = firstInStockSize(p) ?? size;
		if (stockOf(p, size) <= 0) return;
		cart.add(p.slug, size, 1);
		wishlist.toggle(p.slug);
		movedName = p.name;
		setTimeout(() => (movedName = ''), 3000);
	}

	function stockLabel(p: Product): { text: string; cls: string } {
		if (p.stock <= 0) return { text: 'Out of stock', cls: 'text-red-600' };
		if (p.stock <= 7) return { text: `Only ${p.stock} left`, cls: 'text-amber-700' };
		return { text: 'In stock', cls: 'text-emerald-700' };
	}
</script>

<svelte:head>
	<Seo
		title="Wishlist — Shoemate"
		description="Your saved sneakers on Shoemate — stock and price at a glance, ready to move to your cart."
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Wishlist' }])} />

<section class="pt-8">
	<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Wishlist</h1>
	<p class="mt-1 text-[15px] text-ink-soft">
		{saved.length} saved item{saved.length === 1 ? '' : 's'} · Saved in this browser only
	</p>

	{#if movedName}
		<p class="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700" role="status">
			<Check size={18} weight="bold" /> {movedName} moved to your cart.
		</p>
	{/if}

	{#if saved.length}
		<ul class="mt-8 space-y-4">
			{#each saved as p (p.slug)}
				{@const stock = stockLabel(p)}
				<li class="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-card sm:flex-row sm:items-center sm:gap-5 sm:p-5">
					<a href="/product/{p.slug}" class="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-mist sm:h-28 sm:w-28">
						<img src={responsiveImage(p.image).src} srcset={responsiveImage(p.image).srcset} sizes="(max-width: 639px) 96px, 112px" alt={p.name} class="h-full w-full object-cover" width="224" height="224" loading="lazy" />
					</a>
					<div class="min-w-0 flex-1">
						<a href="/product/{p.slug}" class="text-lg font-bold hover:text-brand-600">{p.name}</a>
						<p class="mt-0.5 text-sm text-ink-soft">{p.brand} · ★ {p.rating} ({p.reviews.toLocaleString()} reviews)</p>
						<p class="mt-1.5 flex flex-wrap items-baseline gap-2">
							<span class="text-lg font-extrabold">${p.price}</span>
							{#if p.oldPrice}<span class="text-sm text-ink-soft line-through">${p.oldPrice}</span>{/if}
							<span class="text-sm font-semibold {stock.cls}">· {stock.text}</span>
						</p>
					</div>
					<div class="flex flex-col gap-2 sm:w-56 sm:shrink-0">
						<label class="sr-only" for="size-{p.slug}">Size for {p.name}</label>
						<select
							id="size-{p.slug}"
							value={sizeFor(p)}
							onchange={(e) => (chosenSize[p.slug] = e.currentTarget.value)}
							class="h-12 w-full rounded-full border border-line bg-white px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25"
						>
							{#each SIZES as size (size)}
								{@const s = stockOf(p, size)}
								<option value={size} disabled={s <= 0}>Size {size}{s <= 0 ? ' — out of stock' : ''}</option>
							{/each}
						</select>
						<button
							type="button"
							onclick={() => moveToCart(p)}
							disabled={p.stock <= 0}
							class="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ShoppingBag size={17} weight="bold" /> Move to cart
						</button>
						<button
							type="button"
							onclick={() => wishlist.toggle(p.slug)}
							class="flex h-11 w-full items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-ink-soft hover:bg-mist hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
							aria-label="Remove {p.name} from wishlist"
						>
							<Trash size={17} /> Remove
						</button>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<div class="mt-8 flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-card">
			<span class="flex h-20 w-20 items-center justify-center rounded-full bg-peach text-brand-500">
				<Heart size={34} weight="bold" />
			</span>
			<h2 class="mt-4 text-xl font-extrabold">Nothing saved yet</h2>
			<p class="mt-1 max-w-sm text-sm text-ink-soft">
				Tap the heart on any sneaker to keep it here for later.
			</p>
			<a href="/shop" class="mt-6 flex h-12 items-center gap-2 rounded-full bg-brand-500 px-7 text-sm font-semibold text-white hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
				Shop sneakers <ArrowRight size={17} weight="bold" />
			</a>
		</div>
	{/if}
</section>
