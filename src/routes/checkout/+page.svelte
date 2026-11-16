<script lang="ts">
	import { ArrowRight, Check, CreditCard, Lock, ShieldCheck } from 'phosphor-svelte';
	import { cart } from '#lib/store.svelte';
	import { getProduct } from '#lib/data/products';

	let email = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let address = $state('');
	let city = $state('');
	let zip = $state('');
	let cardName = $state('');
	let cardNumber = $state('');
	let expiry = $state('');
	let cvc = $state('');
	let promo = $state('');
	let promoApplied = $state(false);
	let error = $state('');
	let orderNo = $state<string | null>(null);
	let placing = $state(false);

	let discount = $derived(promoApplied ? Math.round(cart.subtotal * 0.1) : 0);
	let shipping = $derived(cart.subtotal - discount >= 150 || cart.subtotal === 0 ? 0 : 9);
	let total = $derived(cart.subtotal - discount + shipping);

	function placeOrder(e: SubmitEvent) {
		e.preventDefault();
		if (!email.includes('@') || !firstName.trim() || !address.trim() || !city.trim() || !zip.trim()) {
			error = 'Please fill in your contact and shipping details.';
			return;
		}
		if (cardNumber.replace(/\s/g, '').length < 15 || expiry.length < 5 || cvc.length < 3) {
			error = 'Please check your card details.';
			return;
		}
		error = '';
		placing = true;
		setTimeout(() => {
			orderNo = `SM-${Date.now().toString(36).toUpperCase()}`;
			cart.clear();
			placing = false;
		}, 900);
	}
</script>

<svelte:head>
	<title>Checkout — Shoemate</title>
</svelte:head>

<section class="pt-8">
	{#if orderNo}
		<div class="mx-auto max-w-lg rounded-[2rem] bg-white px-6 py-12 text-center shadow-card sm:px-10">
			<span class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
				<Check size={38} weight="bold" />
			</span>
			<h1 class="mt-5 text-3xl font-extrabold">Order confirmed!</h1>
			<p class="mt-2 text-[15px] text-ink-soft">
				Thanks for shopping with Shoemate. Your order <strong class="text-ink">{orderNo}</strong> is being packed — a confirmation email is on its way to {email}.
			</p>
			<p class="mt-3 text-sm text-ink-soft">Estimated delivery: 2–4 business days. Track it from your inbox.</p>
			<a href="/shop" class="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-white hover:bg-brand-500">
				Continue shopping <ArrowRight size={17} weight="bold" />
			</a>
		</div>
	{:else if cart.lines.length === 0}
		<div class="mx-auto max-w-lg rounded-[2rem] bg-white px-6 py-12 text-center shadow-card">
			<h1 class="text-2xl font-extrabold">Nothing to check out yet</h1>
			<p class="mt-2 text-[15px] text-ink-soft">Your cart is empty. Add a pair first.</p>
			<a href="/shop" class="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-brand-500 px-7 text-sm font-semibold text-white hover:bg-brand-600">
				Shop sneakers <ArrowRight size={17} weight="bold" />
			</a>
		</div>
	{:else}
		<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Checkout</h1>
		<p class="mt-1 flex items-start gap-1.5 text-sm text-ink-soft">
			<Lock size={15} class="mt-0.5 shrink-0 text-brand-500" /> Demo checkout — no real payment is taken and no card is charged.
		</p>

		<form class="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]" onsubmit={placeOrder}>
			<div class="min-w-0 space-y-6">
				<fieldset class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
					<legend class="px-2 text-lg font-extrabold">Contact</legend>
					<label for="co-email" class="text-sm font-semibold">Email</label>
					<input id="co-email" type="email" bind:value={email} placeholder="you@example.com" autocomplete="email" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
				</fieldset>

				<fieldset class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
					<legend class="px-2 text-lg font-extrabold">Shipping address</legend>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label for="co-first" class="text-sm font-semibold">First name</label>
							<input id="co-first" type="text" bind:value={firstName} autocomplete="given-name" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div>
							<label for="co-last" class="text-sm font-semibold">Last name</label>
							<input id="co-last" type="text" bind:value={lastName} autocomplete="family-name" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div class="sm:col-span-2">
							<label for="co-address" class="text-sm font-semibold">Street address</label>
							<input id="co-address" type="text" bind:value={address} autocomplete="street-address" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div>
							<label for="co-city" class="text-sm font-semibold">City</label>
							<input id="co-city" type="text" bind:value={city} autocomplete="address-level2" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div>
							<label for="co-zip" class="text-sm font-semibold">ZIP / Postcode</label>
							<input id="co-zip" type="text" bind:value={zip} autocomplete="postal-code" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
					</div>
				</fieldset>

				<fieldset class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
					<legend class="px-2 text-lg font-extrabold">Payment</legend>
					<p class="flex items-center gap-2 text-sm text-ink-soft"><CreditCard size={18} class="text-brand-500" /> Card details are never stored in this demo.</p>
					<div class="mt-4 grid gap-4 sm:grid-cols-2">
						<div class="sm:col-span-2">
							<label for="co-cardname" class="text-sm font-semibold">Name on card</label>
							<input id="co-cardname" type="text" bind:value={cardName} autocomplete="cc-name" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div class="sm:col-span-2">
							<label for="co-cardnum" class="text-sm font-semibold">Card number</label>
							<input id="co-cardnum" type="text" inputmode="numeric" bind:value={cardNumber} placeholder="4242 4242 4242 4242" autocomplete="cc-number" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 font-mono text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div>
							<label for="co-expiry" class="text-sm font-semibold">Expiry (MM/YY)</label>
							<input id="co-expiry" type="text" bind:value={expiry} placeholder="12/28" autocomplete="cc-exp" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 font-mono text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div>
							<label for="co-cvc" class="text-sm font-semibold">CVC</label>
							<input id="co-cvc" type="text" inputmode="numeric" bind:value={cvc} placeholder="123" autocomplete="cc-csc" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 font-mono text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
					</div>
				</fieldset>

				{#if error}
					<p class="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</p>
				{/if}
			</div>

			<aside class="h-fit min-w-0 rounded-3xl bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
				<h2 class="text-lg font-extrabold">Order summary</h2>
				<ul class="mt-4 space-y-3">
					{#each cart.lines as line (line.slug + line.size)}
						{@const p = getProduct(line.slug)}
						{#if p}
							<li class="flex items-center gap-3 text-sm">
								<img src={p.image} alt="" class="h-12 w-12 shrink-0 rounded-xl bg-mist object-cover" width="96" height="96" />
								<span class="min-w-0 flex-1">
									<span class="block truncate font-semibold">{p.name}</span>
									<span class="text-xs text-ink-soft">{line.size} × {line.qty}</span>
								</span>
								<span class="shrink-0 font-bold">${p.price * line.qty}</span>
							</li>
						{/if}
					{/each}
				</ul>
				<div class="mt-4 flex gap-2">
					<label class="sr-only" for="co-promo">Promo code</label>
					<input id="co-promo" type="text" bind:value={promo} placeholder="SHOEMATE10 for 10% off" class="h-11 min-w-0 flex-1 rounded-full border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
					<button type="button" onclick={() => (promoApplied = promo.trim().toUpperCase() === 'SHOEMATE10')} class="h-11 shrink-0 rounded-full bg-ink px-4 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">Apply</button>
				</div>
				{#if promoApplied}
					<p class="mt-2 text-[13px] font-semibold text-emerald-700">Code applied — 10% off.</p>
				{/if}
				<dl class="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
					<div class="flex justify-between"><dt class="text-ink-soft">Subtotal</dt><dd class="font-semibold">${cart.subtotal}</dd></div>
					{#if discount}
						<div class="flex justify-between text-emerald-700"><dt>Discount</dt><dd class="font-semibold">−${discount}</dd></div>
					{/if}
					<div class="flex justify-between"><dt class="text-ink-soft">Shipping</dt><dd class="font-semibold">{shipping === 0 ? 'Free' : `$${shipping}`}</dd></div>
					<div class="flex justify-between border-t border-line pt-3 text-base"><dt class="font-bold">Total</dt><dd class="font-extrabold">${total}</dd></div>
				</dl>
				<button type="submit" disabled={placing} class="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60">
					{placing ? 'Placing order…' : `Place order · $${total}`}
				</button>
				<p class="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
					<ShieldCheck size={15} class="text-brand-500" /> 30-day returns · Authenticity guaranteed
				</p>
			</aside>
		</form>
	{/if}
</section>
