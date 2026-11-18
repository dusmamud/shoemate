<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { ArrowLeft, ArrowRight, Package, Repeat, ShoppingBag } from 'phosphor-svelte';
	import AccountNav from '#lib/components/AccountNav.svelte';
	import OrderTimeline from '#lib/components/OrderTimeline.svelte';
	import { cart, orders, type Order } from '#lib/store.svelte';
	import { getProduct } from '#lib/data/products';
	import { responsiveImage } from '#lib/images';
	import { toast } from '#lib/toast.svelte';

	// Detail view is a query param (?id=SM-…) on this same prerendered page:
	// adapter-static has no fallback, so a dynamic [id] route cannot be built.
	// searchParams must only be read in the browser — prerendering forbids it.
	let detailId = $state('');
	$effect(() => {
		detailId = page.url.searchParams.get('id') ?? '';
	});
	let detail = $derived(detailId ? orders.get(detailId) : undefined);
	let list = $derived(orders.list());

	function fmtDate(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function buyAgain(order: Order) {
		// F-03: never re-add an out-of-stock line. Buy-again keeps the SAME
		// size (no silent substitution) — an OOS line is skipped and reported
		// by toast; if nothing could be added we stay on the page.
		const skipped: string[] = [];
		let added = 0;
		for (const item of order.items) {
			const product = getProduct(item.slug);
			const size = item.size || 'UK 9';
			const inStock = product ? (product.sizeStock.find((s) => s.size === size)?.stock ?? 0) > 0 : false;
			if (!product || !inStock) {
				skipped.push(product ? `${product.name} (${size})` : item.slug);
				continue;
			}
			cart.add(item.slug, size, item.qty);
			added++;
		}
		if (skipped.length) {
			toast.info(
				added > 0
					? `Added ${added} item${added === 1 ? '' : 's'} to your cart. Skipped (out of stock): ${skipped.join(', ')}.`
					: `Nothing added — out of stock in that size: ${skipped.join(', ')}.`
			);
		}
		if (added > 0) goto('/cart');
	}

	function statusCls(status: Order['status']): string {
		switch (status) {
			case 'Delivered':
				return 'bg-emerald-50 text-emerald-700';
			case 'Shipped':
				return 'bg-sky-50 text-sky-700';
			case 'Packed':
				return 'bg-amber-50 text-amber-700';
			default:
				return 'bg-peach text-brand-700';
		}
	}
</script>

<svelte:head>
	<Seo
		title={detail ? `Order ${detail.id} — Shoemate` : 'Orders — Shoemate'}
		description="Your Shoemate orders — status, items and totals, stored locally in this browser (demo)."
		noindex
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Account', href: '/account/' }, { name: 'Orders' }])} />

<section class="pt-8">
	{#if detailId}
		<!-- ── Order detail ─────────────────────────────────────────── -->
		<a href="/account/orders" class="inline-flex h-11 items-center gap-2 rounded-full px-3 -ml-3 text-sm font-semibold text-ink-soft hover:bg-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
			<ArrowLeft size={17} weight="bold" /> All orders
		</a>
		{#if detail}
			<h1 class="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Order {detail.id}</h1>
			<p class="mt-1 text-[15px] text-ink-soft">
				Placed {fmtDate(detail.date)} · <span class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold {statusCls(detail.status)}">{detail.status}</span>
			</p>

			<div class="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
				<div class="min-w-0 space-y-6">
					<div class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
						<h2 class="text-lg font-extrabold">Items</h2>
						<ul class="mt-4 space-y-4">
							{#each detail.items as item (item.slug + item.size)}
								{@const p = getProduct(item.slug)}
								<li class="flex items-center gap-3">
									{#if p}
										<a href="/product/{p.slug}" class="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mist">
											<img src={responsiveImage(p.image).src} srcset={responsiveImage(p.image).srcset} sizes="64px" alt={p.name} class="h-full w-full object-cover" width="128" height="128" loading="lazy" />
										</a>
									{/if}
									<span class="min-w-0 flex-1 text-sm">
										<span class="block truncate font-bold">{item.name}</span>
										<span class="text-ink-soft">Size {item.size}{item.colour ? ` · ${item.colour}` : ''} × {item.qty}</span>
									</span>
									<span class="shrink-0 text-sm font-extrabold">${item.price * item.qty}</span>
								</li>
							{/each}
						</ul>
						<dl class="mt-5 space-y-2 border-t border-line pt-4 text-sm">
							<div class="flex justify-between"><dt class="text-ink-soft">Subtotal</dt><dd class="font-semibold">${detail.subtotal}</dd></div>
							{#if detail.discount}
								<div class="flex justify-between text-emerald-700"><dt>Discount</dt><dd class="font-semibold">−${detail.discount}</dd></div>
							{/if}
							<div class="flex justify-between"><dt class="text-ink-soft">Shipping</dt><dd class="font-semibold">{detail.shipping === 0 ? 'Free' : `$${detail.shipping}`}</dd></div>
							<div class="flex justify-between border-t border-line pt-3 text-base"><dt class="font-bold">Total</dt><dd class="font-extrabold">${detail.total}</dd></div>
						</dl>
						<button type="button" onclick={() => buyAgain(detail)} class="mt-5 flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
							<Repeat size={18} weight="bold" /> Buy again
						</button>
					</div>
				</div>
				<aside class="h-fit min-w-0 rounded-3xl bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
					<h2 class="text-lg font-extrabold">Tracking</h2>
					<p class="mt-1 text-[13px] leading-relaxed text-ink-soft">
						Demo tracking — statuses are stored in this browser only. Real carrier tracking arrives with the Go backend.
					</p>
					<div class="mt-5">
						<OrderTimeline steps={detail.timeline} />
					</div>
					<a href="/track?id={detail.id}" class="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-mist px-5 text-sm font-semibold hover:bg-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
						Open in tracker <ArrowRight size={16} weight="bold" />
					</a>
				</aside>
			</div>
		{:else}
			<h1 class="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Order not found</h1>
			<p class="mt-2 max-w-md text-[15px] text-ink-soft">
				We couldn't find order <strong class="text-ink">{detailId}</strong> in this browser. Orders are stored locally — a different device or a cleared browser won't have them.
			</p>
			<a href="/account/orders" class="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
				Back to orders
			</a>
		{/if}
	{:else}
		<!-- ── Order list ───────────────────────────────────────────── -->
		<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Orders</h1>
		<p class="mt-1 text-[15px] text-ink-soft">
			{list.length} order{list.length === 1 ? '' : 's'} · Stored in this browser only (demo)
		</p>

		<div class="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
			<AccountNav />

			<div class="min-w-0">
				{#if list.length}
					<ul class="space-y-4">
						{#each list as order (order.id)}
							<li class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
								<div class="flex flex-wrap items-start justify-between gap-3">
									<div class="min-w-0">
										<p class="font-extrabold">{order.id}</p>
										<p class="mt-0.5 text-sm text-ink-soft">
											{fmtDate(order.date)} · {order.items.reduce((n, i) => n + i.qty, 0)} item{order.items.reduce((n, i) => n + i.qty, 0) === 1 ? '' : 's'} · ${order.total}
										</p>
										<p class="mt-1.5 truncate text-sm text-ink-soft">
											{order.items.map((i) => i.name).join(', ')}
										</p>
									</div>
									<span class="rounded-full px-3 py-1 text-xs font-bold {statusCls(order.status)}">{order.status}</span>
								</div>
								<div class="mt-4 flex flex-wrap gap-2">
									<a href="/account/orders?id={order.id}" class="flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
										View details <ArrowRight size={16} weight="bold" />
									</a>
									<button type="button" onclick={() => buyAgain(order)} class="flex h-11 items-center gap-2 rounded-full bg-mist px-5 text-sm font-semibold hover:bg-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
										<Repeat size={17} /> Buy again
									</button>
									<a href="/track?id={order.id}" class="flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-soft hover:bg-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
										Track
									</a>
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<div class="flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-card">
						<span class="flex h-20 w-20 items-center justify-center rounded-full bg-peach text-brand-500">
							<ShoppingBag size={34} weight="bold" />
						</span>
						<h2 class="mt-4 text-xl font-extrabold">No orders yet</h2>
						<p class="mt-1 max-w-sm text-sm text-ink-soft">
							Orders you place at demo checkout will show up here, with a status timeline you can follow.
						</p>
						<a href="/shop" class="mt-6 flex h-12 items-center gap-2 rounded-full bg-brand-500 px-7 text-sm font-semibold text-white hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
							Shop sneakers <ArrowRight size={17} weight="bold" />
						</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</section>
