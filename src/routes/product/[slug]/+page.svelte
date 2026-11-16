<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { ArrowCounterClockwise, ArrowRight, Check, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck } from 'phosphor-svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Reveal from '#lib/components/Reveal.svelte';
	import { getProduct, relatedProducts } from '#lib/data/products';
	import { cart, ui, wishlist } from '#lib/store.svelte';

	const product = $derived(getProduct(page.params.slug ?? ''));
	const related = $derived(product ? relatedProducts(product.slug) : []);

	let size = $state<string | null>(null);
	let qty = $state(1);
	let sizeError = $state(false);
	let justAdded = $state(false);

	function addToCart(openDrawer = true) {
		if (!product) return;
		if (!size) {
			sizeError = true;
			document.getElementById('size-heading')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}
		cart.add(product.slug, size, qty);
		justAdded = true;
		setTimeout(() => (justAdded = false), 1600);
		if (openDrawer) ui.cartOpen = true;
	}

	function buyNow() {
		if (!product || !size) {
			sizeError = true;
			return;
		}
		cart.add(product.slug, size, qty);
		goto('/checkout');
	}
</script>

<svelte:head>
	{#if product}
		<title>{product.name} — ${product.price} · Shoemate</title>
		<meta name="description" content="{product.name} by {product.brand}. {product.blurb} Free shipping over $150 at Shoemate." />
	{:else}
		<title>Product not found — Shoemate</title>
	{/if}
</svelte:head>

{#if product}
	<section class="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
		<nav aria-label="Breadcrumb" class="text-[13px] text-ink-soft">
			<a href="/" class="hover:text-brand-600">Home</a> <span aria-hidden="true">/</span>
			<a href="/shop" class="hover:text-brand-600">Shop</a> <span aria-hidden="true">/</span>
			<span class="font-medium text-ink">{product.name}</span>
		</nav>

		<div class="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
			<div class="relative overflow-hidden rounded-[2rem] bg-white shadow-card">
				<img src={product.image} alt={product.name} width="1600" height="1600" class="aspect-square w-full object-cover" fetchpriority="high" />
				{#if product.badge}
					<span class="absolute top-4 left-4 rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold tracking-wide text-white uppercase">{product.badge}</span>
				{/if}
				{#if product.oldPrice}
					<span class="absolute top-4 right-4 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-extrabold text-white">
						SAVE ${product.oldPrice - product.price}
					</span>
				{/if}
			</div>

			<div>
				<p class="text-sm font-bold tracking-widest text-brand-500 uppercase">{product.brand} · {product.category}</p>
				<h1 class="mt-2 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{product.name}</h1>
				<p class="mt-2 flex flex-wrap items-center gap-2 text-sm">
					<span class="flex items-center gap-1 font-semibold">
						<Star size={16} weight="fill" class="text-amber-400" /> {product.rating.toFixed(1)}
					</span>
					<span class="text-ink-soft">({product.reviews.toLocaleString()} reviews)</span>
					<span class="text-ink-soft">·</span>
					<span class={product.stock <= 7 ? 'font-semibold text-red-600' : 'font-medium text-emerald-700'}>
						{product.stock <= 7 ? `Only ${product.stock} left in stock` : 'In stock'}
					</span>
				</p>

				<div class="mt-4 flex items-baseline gap-3">
					<span class="text-3xl font-extrabold">${product.price}</span>
					{#if product.oldPrice}
						<span class="text-lg text-ink-soft line-through">${product.oldPrice}</span>
						<span class="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">
							{Math.round((1 - product.price / product.oldPrice) * 100)}% off
						</span>
					{/if}
				</div>
				<p class="mt-1 text-xs text-ink-soft">or 4 interest-free payments of ${(product.price / 4).toFixed(2)}</p>

				<p class="mt-5 text-[15px] leading-relaxed text-ink-soft">{product.description}</p>

				<div class="mt-7">
					<div class="flex items-center justify-between">
						<h2 id="size-heading" class="text-sm font-bold">Select size <span class="font-normal text-ink-soft">(UK)</span></h2>
						<button type="button" class="text-[13px] font-medium text-brand-600 underline underline-offset-2" onclick={() => alert('True to size. If you are between sizes, go half a size up.')}>
							Size guide
						</button>
					</div>
					<div class="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Choose a size">
						{#each product.sizes as s}
							<button
								type="button"
								role="radio"
								aria-checked={size === s}
								onclick={() => {
									size = s;
									sizeError = false;
								}}
								class="flex h-12 items-center justify-center rounded-2xl border-2 text-sm font-semibold transition-all {size === s
									? 'border-ink bg-ink text-white'
									: 'border-line bg-white hover:border-ink'}"
							>
								{s}
							</button>
						{/each}
					</div>
					{#if sizeError}
						<p class="mt-2 text-sm font-medium text-red-600" role="alert">Please choose a size first.</p>
					{/if}
				</div>

				<div class="mt-6">
					<p class="text-sm font-bold">Colours</p>
					<div class="mt-2 flex gap-2">
						{#each product.colors as c}
							<span class="h-8 w-8 rounded-full border-2 border-white shadow-md ring-1 ring-line" style="background: {c}" title="Colour option"></span>
						{/each}
					</div>
				</div>

				<div class="mt-7 flex flex-wrap items-center gap-3">
					<div class="flex items-center rounded-full border border-line bg-white">
						<button type="button" onclick={() => (qty = Math.max(1, qty - 1))} class="flex h-12 w-11 items-center justify-center" aria-label="Decrease quantity">
							<Minus size={17} weight="bold" />
						</button>
						<span class="w-8 text-center font-bold" aria-live="polite">{qty}</span>
						<button type="button" onclick={() => (qty = Math.min(9, qty + 1))} class="flex h-12 w-11 items-center justify-center" aria-label="Increase quantity">
							<Plus size={17} weight="bold" />
						</button>
					</div>
					<button
						type="button"
						onclick={() => addToCart(true)}
						class="flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-colors {justAdded
							? 'bg-emerald-600'
							: 'bg-ink hover:bg-brand-500'}"
					>
						{#if justAdded}
							<Check size={18} weight="bold" /> Added to cart
						{:else}
							<ShoppingBag size={18} weight="bold" /> Add to cart — ${product.price * qty}
						{/if}
					</button>
					<button
						type="button"
						onclick={() => wishlist.toggle(product.slug)}
						aria-pressed={wishlist.has(product.slug)}
						aria-label="Toggle wishlist"
						class="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-brand-500 {wishlist.has(product.slug)
							? 'text-brand-500'
							: ''}"
					>
						<Heart size={20} weight={wishlist.has(product.slug) ? 'fill' : 'regular'} />
					</button>
				</div>
				<button
					type="button"
					onclick={buyNow}
					class="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
				>
					Buy it now <ArrowRight size={17} weight="bold" />
				</button>

				<ul class="mt-7 space-y-2.5 border-t border-line pt-5 text-sm">
					<li class="flex items-center gap-2.5"><Truck size={19} class="shrink-0 text-brand-500" /> Free shipping over $150 · arrives in 2–4 days</li>
					<li class="flex items-center gap-2.5"><ArrowCounterClockwise size={19} class="shrink-0 text-brand-500" /> Free 30-day returns, no questions asked</li>
					<li class="flex items-center gap-2.5"><ShieldCheck size={19} class="shrink-0 text-brand-500" /> 100% authentic — verified before dispatch</li>
				</ul>

				<div class="mt-6 divide-y divide-line rounded-3xl border border-line bg-white">
					<details class="px-5 py-4">
						<summary class="cursor-pointer text-sm font-bold">Shipping &amp; delivery</summary>
						<p class="mt-2 text-sm leading-relaxed text-ink-soft">Orders ship within 24 hours from our Portland warehouse. Standard delivery is 2–4 business days; express (1–2 days) is available at checkout.</p>
					</details>
					<details class="px-5 py-4">
						<summary class="cursor-pointer text-sm font-bold">Returns &amp; exchanges</summary>
						<p class="mt-2 text-sm leading-relaxed text-ink-soft">Unworn shoes can be returned within 30 days for a full refund or a free size exchange.</p>
					</details>
					<details class="px-5 py-4">
						<summary class="cursor-pointer text-sm font-bold">Materials &amp; care</summary>
						<p class="mt-2 text-sm leading-relaxed text-ink-soft">Spot-clean with a soft brush and mild soap. Air-dry away from direct heat — never machine-wash.</p>
					</details>
				</div>
			</div>
		</div>

		<section class="pt-16">
			<Reveal>
				<h2 class="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">You may also like</h2>
			</Reveal>
			<div class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
				{#each related as p, i}
					<Reveal delay={i * 60}>
						<ProductCard product={p} />
					</Reveal>
				{/each}
			</div>
		</section>
	</section>
{:else}
	<section class="mx-auto max-w-7xl px-4 pt-20 pb-10 text-center sm:px-6">
		<h1 class="text-3xl font-extrabold">Product not found</h1>
		<p class="mt-2 text-ink-soft">That pair may have sold out or moved. Browse the latest drops instead.</p>
		<a href="/shop" class="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-white hover:bg-brand-500">
			Back to shop <ArrowRight size={17} weight="bold" />
		</a>
	</section>
{/if}
