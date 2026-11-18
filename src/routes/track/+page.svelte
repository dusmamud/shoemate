<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Check, MagnifyingGlass, Package, Truck } from 'phosphor-svelte';
	import OrderTimeline from '#lib/components/OrderTimeline.svelte';
	import { orders, type Order } from '#lib/store.svelte';

	// searchParams must only be read in the browser — prerendering forbids it.
	let query = $state('');
	let searched = $state('');
	$effect(() => {
		const id = page.url.searchParams.get('id') ?? '';
		query = id;
		searched = id;
	});
	let found = $derived(searched ? orders.get(searched.trim().toUpperCase()) : undefined);
	let lookedUp = $derived(searched.length > 0);

	function fmtDate(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function lookup(e: SubmitEvent) {
		e.preventDefault();
		const id = query.trim().toUpperCase();
		searched = id;
		goto(`/track?id=${encodeURIComponent(id)}`, { replaceState: true });
	}
</script>

<svelte:head>
	<Seo
		title="Track Your Order — Shoemate"
		description="Track your Shoemate order by its SM- number — demo tracking stored locally in this browser."
		noindex
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Track Order' }])} />

<section class="pt-8">
	<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Track your order</h1>
	<p class="mt-1 text-[15px] text-ink-soft">
		Enter your order number (it starts with SM-). Demo tracking — orders live in this browser only.
	</p>

	<form onsubmit={lookup} class="mt-6 flex max-w-xl gap-2">
		<label class="sr-only" for="track-id">Order number</label>
		<input
			id="track-id"
			type="text"
			bind:value={query}
			placeholder="SM-XXXXXXXX"
			autocomplete="off"
			autocapitalize="characters"
			class="h-12 min-w-0 flex-1 rounded-full border border-line bg-white px-5 font-mono text-base uppercase outline-none placeholder:normal-case focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25"
		/>
		<button type="submit" class="flex h-12 shrink-0 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
			<MagnifyingGlass size={18} weight="bold" /> Track
		</button>
	</form>

	{#if lookedUp}
		<div class="mt-8 max-w-xl">
			{#if found}
				{@const order = found as Order}
				<div class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
					<div class="flex items-start justify-between gap-3">
						<div>
							<p class="flex items-center gap-2 text-lg font-extrabold">
								<Package size={21} weight="bold" class="text-brand-500" /> {order.id}
							</p>
							<p class="mt-0.5 text-sm text-ink-soft">
								Placed {fmtDate(order.date)} · {order.items.reduce((n, i) => n + i.qty, 0)} item{order.items.reduce((n, i) => n + i.qty, 0) === 1 ? '' : 's'} · ${order.total}
							</p>
						</div>
						<span class="rounded-full bg-peach px-3 py-1 text-xs font-bold text-brand-700">{order.status}</span>
					</div>
					<div class="mt-6">
						<OrderTimeline steps={order.timeline} />
					</div>
					<a href="/account/orders?id={order.id}" class="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-mist px-5 text-sm font-semibold hover:bg-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
						View full order details
					</a>
				</div>
			{:else}
				<div class="rounded-3xl bg-white p-5 text-center shadow-card sm:p-6">
					<span class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-peach text-brand-500">
						<Truck size={30} weight="bold" />
					</span>
					<h2 class="mt-4 text-xl font-extrabold">We couldn't find {searched}</h2>
					<p class="mx-auto mt-1 max-w-sm text-sm text-ink-soft">
						Orders are stored in this browser only. Check the number — it looks like <span class="font-mono">SM-XXXXXXXX</span> — or try the device you ordered on.
					</p>
					<p class="mt-3 text-[13px] text-ink-soft">
						Your orders are also listed under <a href="/account/orders" class="font-semibold text-brand-600 underline">My account → Orders</a>.
					</p>
				</div>
			{/if}
		</div>
	{:else}
		<p class="mt-8 flex max-w-xl items-start gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-ink-soft shadow-card">
			<Check size={17} weight="bold" class="mt-0.5 shrink-0 text-emerald-600" />
			<span>Your order number is on the checkout confirmation screen and in your order list — it starts with SM-.</span>
		</p>
	{/if}
</section>
