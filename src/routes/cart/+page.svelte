<script lang="ts">
	import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash, Truck } from 'phosphor-svelte';
	import { cart } from '#lib/store.svelte';
	import { getProduct } from '#lib/data/products';

	let promo = $state('');
	let promoApplied = $state(false);
	let promoError = $state(false);

	let discount = $derived(promoApplied ? Math.round(cart.subtotal * 0.1) : 0);
	let shipping = $derived(cart.subtotal - discount >= 150 || cart.subtotal === 0 ? 0 : 9);
	let total = $derived(cart.subtotal - discount + shipping);

	function applyPromo() {
		if (promo.trim().toUpperCase() === 'SHOEMATE10') {
			promoApplied = true;
			promoError = false;
		} else {
			promoError = true;
		}
	}
</script>

<svelte:head>
	<title>Your Cart — Shoemate</title>
</svelte:head>

<section class="pt-8">
	<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Your Cart</h1>
	<p class="mt-1 text-[15px] text-ink-soft">{cart.count} item{cart.count === 1 ? '' : 's'} · Free shipping over $150</p>

	{#if cart.lines.length}
		<div class="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
			<ul class="divide-y divide-line rounded-3xl bg-white px-5 shadow-card sm:px-6">
				{#each cart.lines as line (line.slug + line.size)}
					{@const p = getProduct(line.slug)}
					{#if p}
						<li class="flex gap-4 py-5">
							<a href="/product/{p.slug}" class="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-mist sm:h-28 sm:w-28">
								<img src={p.image} alt={p.name} class="h-full w-full object-cover" width="224" height="224" />
							</a>
							<div class="flex min-w-0 flex-1 flex-col">
								<div class="flex items-start justify-between gap-3">
									<div>
										<a href="/product/{p.slug}" class="font-bold hover:text-brand-600 sm:text-lg">{p.name}</a>
										<p class="mt-0.5 text-sm text-ink-soft">{p.brand} · Size {line.size}</p>
									</div>
									<button type="button" onclick={() => cart.remove(line.slug, line.size)} class="flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-red-600" aria-label="Remove {p.name}">
										<Trash size={17} /> <span class="hidden sm:inline">Remove</span>
									</button>
								</div>
								<div class="mt-auto flex items-center justify-between pt-3">
									<div class="flex items-center rounded-full border border-line">
										<button type="button" onclick={() => cart.setQty(line.slug, line.size, line.qty - 1)} class="flex h-9 w-9 items-center justify-center" aria-label="Decrease quantity"><Minus size={15} weight="bold" /></button>
										<span class="w-7 text-center text-sm font-bold">{line.qty}</span>
										<button type="button" onclick={() => cart.setQty(line.slug, line.size, line.qty + 1)} class="flex h-9 w-9 items-center justify-center" aria-label="Increase quantity"><Plus size={15} weight="bold" /></button>
									</div>
									<span class="font-extrabold">${p.price * line.qty}</span>
								</div>
							</div>
						</li>
					{/if}
				{/each}
			</ul>

			<aside class="h-fit rounded-3xl bg-white p-6 shadow-card lg:sticky lg:top-24">
				<h2 class="text-lg font-extrabold">Order summary</h2>
				{#if promoApplied}
					<p class="mt-3 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
						Code SHOEMATE10 applied <button type="button" onclick={() => { promoApplied = false; promo = ''; }} class="underline">Remove</button>
					</p>
				{:else}
					<div class="mt-4 flex gap-2">
						<label class="sr-only" for="promo">Promo code</label>
						<input id="promo" type="text" bind:value={promo} placeholder="Promo code (try SHOEMATE10)" class="h-11 min-w-0 flex-1 rounded-full border border-line px-4 text-sm outline-none focus:border-brand-500" />
						<button type="button" onclick={applyPromo} class="h-11 shrink-0 rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-brand-500">Apply</button>
					</div>
					{#if promoError}
						<p class="mt-2 text-[13px] font-medium text-red-600" role="alert">That code is not valid. Try SHOEMATE10.</p>
					{/if}
				{/if}
				<dl class="mt-5 space-y-2.5 text-sm">
					<div class="flex justify-between"><dt class="text-ink-soft">Subtotal</dt><dd class="font-semibold">${cart.subtotal}</dd></div>
					{#if discount}
						<div class="flex justify-between text-emerald-700"><dt>Discount (10%)</dt><dd class="font-semibold">−${discount}</dd></div>
					{/if}
					<div class="flex justify-between"><dt class="text-ink-soft">Shipping</dt><dd class="font-semibold">{shipping === 0 ? 'Free' : `$${shipping}`}</dd></div>
					<div class="flex justify-between border-t border-line pt-3 text-base"><dt class="font-bold">Total</dt><dd class="font-extrabold">${total}</dd></div>
				</dl>
				<a href="/checkout" class="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-brand-500">
					Proceed to checkout <ArrowRight size={17} weight="bold" />
				</a>
				<p class="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
					<ShieldCheck size={15} class="text-brand-500" /> Secure checkout · 30-day returns
				</p>
				<p class="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
					<Truck size={15} class="text-brand-500" /> Free shipping unlocked at $150
				</p>
			</aside>
		</div>
	{:else}
		<div class="mt-8 flex flex-col items-center rounded-3xl bg-white px-6 py-16 text-center shadow-card">
			<span class="flex h-20 w-20 items-center justify-center rounded-full bg-peach text-brand-500">
				<ShoppingBag size={34} weight="bold" />
			</span>
			<h2 class="mt-4 text-xl font-extrabold">Your cart is empty</h2>
			<p class="mt-1 max-w-sm text-sm text-ink-soft">Fresh drops are waiting. Go find your next pair.</p>
			<a href="/shop" class="mt-6 flex h-12 items-center gap-2 rounded-full bg-brand-500 px-7 text-sm font-semibold text-white hover:bg-brand-600">
				Shop sneakers <ArrowRight size={17} weight="bold" />
			</a>
		</div>
	{/if}
</section>
