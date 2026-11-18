<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { Check, Gift, Heart, MapPin, Package, SignOut, Sparkle } from 'phosphor-svelte';
	import AccountNav from '#lib/components/AccountNav.svelte';
	import { addresses, getRewards, orders, wishlist } from '#lib/store.svelte';

	interface StoredUser {
		name: string;
		email: string;
	}

	let storedUser = $state<StoredUser | null>(null);
	let nameDraft = $state('');
	let savedName = $state(false);

	if (browser) {
		try {
			const raw = localStorage.getItem('shoemate:user');
			if (raw) {
				const parsed = JSON.parse(raw) as StoredUser;
				storedUser = parsed;
				nameDraft = parsed.name;
			}
		} catch {
			storedUser = null;
		}
	}

	let rewards = $derived(getRewards());
	let defaultAddress = $derived(addresses.getDefault());
	let orderCount = $derived(orders.list().length);
	let lastOrder = $derived(orders.list()[0]);

	function saveName() {
		if (!storedUser || !nameDraft.trim()) return;
		storedUser = { ...storedUser, name: nameDraft.trim() };
		if (browser) localStorage.setItem('shoemate:user', JSON.stringify(storedUser));
		savedName = true;
		setTimeout(() => (savedName = false), 2500);
	}

	function signOut() {
		if (browser) localStorage.removeItem('shoemate:user');
		storedUser = null;
		goto('/signin');
	}
</script>

<svelte:head>
	<Seo
		title="My Account — Shoemate"
		description="Your Shoemate account — orders, addresses, rewards and wishlist, all stored locally in this browser (demo)."
		noindex
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Account' }])} />

<section class="pt-8">
	<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
		{storedUser ? `Hello, ${storedUser.name}` : 'My account'}
	</h1>
	<p class="mt-1 text-[15px] text-ink-soft">
		Demo account — everything here lives in this browser until the Go backend arrives.
	</p>

	<div class="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
		<AccountNav />

		<div class="min-w-0 space-y-6">
			{#if !storedUser}
				<div class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
					<h2 class="text-lg font-extrabold">You're browsing as a guest</h2>
					<p class="mt-1 text-sm text-ink-soft">
						Sign in (demo) to attach a name to this device. Your orders and addresses are already saved locally either way.
					</p>
					<a href="/signin" class="mt-4 inline-flex h-12 items-center rounded-full bg-ink px-7 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
						Sign in
					</a>
				</div>
			{/if}

			<div class="grid gap-4 sm:grid-cols-2">
				<a href="/account/orders" class="rounded-3xl bg-white p-5 shadow-card transition-shadow hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
					<span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-peach text-brand-500"><Package size={22} weight="bold" /></span>
					<p class="mt-3 text-2xl font-extrabold">{orderCount}</p>
					<p class="text-sm font-semibold">Order{orderCount === 1 ? '' : 's'}</p>
					<p class="mt-0.5 text-[13px] text-ink-soft">
						{lastOrder ? `Latest: ${lastOrder.id} · ${lastOrder.status}` : 'No orders yet in this browser'}
					</p>
				</a>
				<a href="/wishlist" class="rounded-3xl bg-white p-5 shadow-card transition-shadow hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
					<span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-peach text-brand-500"><Heart size={22} weight="bold" /></span>
					<p class="mt-3 text-2xl font-extrabold">{wishlist.slugs.length}</p>
					<p class="text-sm font-semibold">Saved item{wishlist.slugs.length === 1 ? '' : 's'}</p>
					<p class="mt-0.5 text-[13px] text-ink-soft">Your wishlist, ready when you are</p>
				</a>
				<a href="/rewards" class="rounded-3xl bg-white p-5 shadow-card transition-shadow hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
					<span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-peach text-brand-500"><Sparkle size={22} weight="bold" /></span>
					<p class="mt-3 text-2xl font-extrabold">{rewards.points} pts</p>
					<p class="text-sm font-semibold">{rewards.tier} tier</p>
					<p class="mt-0.5 text-[13px] text-ink-soft">
						{rewards.next ? `${rewards.next.at - rewards.points} pts to ${rewards.next.name}` : 'Top tier — nice work'}
					</p>
				</a>
				<a href="/account/addresses" class="rounded-3xl bg-white p-5 shadow-card transition-shadow hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
					<span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-peach text-brand-500"><MapPin size={22} weight="bold" /></span>
					<p class="mt-3 text-lg leading-snug font-extrabold">
						{defaultAddress ? defaultAddress.label : 'No address saved'}
					</p>
					<p class="text-sm font-semibold">Default address</p>
					<p class="mt-0.5 truncate text-[13px] text-ink-soft">
						{defaultAddress ? `${defaultAddress.street}, ${defaultAddress.city}` : 'Add one for faster checkout'}
					</p>
				</a>
			</div>

			{#if storedUser}
				<div class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
					<h2 class="text-lg font-extrabold">Profile</h2>
					<p class="mt-1 text-sm text-ink-soft">Demo profile — stored in this browser only.</p>
					<div class="mt-4 grid gap-4 sm:grid-cols-2">
						<div>
							<label for="acct-name" class="text-sm font-semibold">Name</label>
							<input id="acct-name" type="text" bind:value={nameDraft} autocomplete="name" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div>
							<label for="acct-email" class="text-sm font-semibold">Email</label>
							<input id="acct-email" type="email" value={storedUser.email} disabled class="mt-1.5 h-12 w-full cursor-not-allowed rounded-2xl border border-line bg-mist px-4 text-base text-ink-soft outline-none" />
						</div>
					</div>
					<div class="mt-4 flex flex-wrap items-center gap-3">
						<button type="button" onclick={saveName} class="flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
							Save name
						</button>
						{#if savedName}
							<p class="flex items-center gap-1.5 text-sm font-semibold text-emerald-700" role="status">
								<Check size={17} weight="bold" /> Saved
							</p>
						{/if}
						<button type="button" onclick={signOut} class="ml-auto flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold text-ink-soft hover:bg-mist hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
							<SignOut size={18} /> Sign out
						</button>
					</div>
				</div>
			{/if}

			<div class="flex flex-wrap gap-3">
				<a href="/track" class="flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold shadow-card hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
					<Package size={18} /> Track an order
				</a>
				<a href="/gift-cards" class="flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold shadow-card hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
					<Gift size={18} /> Gift cards
				</a>
			</div>
		</div>
	</div>
</section>
