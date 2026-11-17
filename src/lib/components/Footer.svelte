<script lang="ts">
	import { browser } from '$app/env';
	import { ArrowRight, Check, Envelope, FacebookLogo, InstagramLogo, Sneaker, XLogo, YoutubeLogo } from 'phosphor-svelte';

	let email = $state('');
	let subscribed = $state(false);
	let currency = $state('USD');

	$effect(() => {
		if (!browser) return;
		try {
			currency = localStorage.getItem('shoemate:currency') ?? 'USD';
		} catch {
			// Display-only preference; ignore storage failures.
		}
	});

	function subscribe(e: SubmitEvent) {
		e.preventDefault();
		if (!email.includes('@')) return;
		subscribed = true;
	}

	function setCurrency(e: Event) {
		currency = (e.currentTarget as HTMLSelectElement).value;
		try {
			localStorage.setItem('shoemate:currency', currency);
		} catch {
			// Display-only preference; ignore storage failures.
		}
	}
</script>

<footer class="mt-20 bg-ink text-white">
	<div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
		<div class="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr]">
			<div class="min-w-0">
				<a href="/" class="flex items-center gap-2" aria-label="Shoemate home">
					<span class="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white">
						<Sneaker size={24} weight="fill" />
					</span>
					<span class="text-xl font-extrabold tracking-tight">
						SHOE<span class="text-brand-400">MATE</span>
					</span>
				</a>
				<p class="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
					Premium sneakers, honest prices and fast delivery. Upgrade your style with essentials that go the distance.
				</p>
				<div class="mt-5 flex gap-2">
					<a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-500">
						<InstagramLogo size={19} />
					</a>
					<a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-500">
						<FacebookLogo size={19} />
					</a>
					<a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-500">
						<XLogo size={19} />
					</a>
					<a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-500">
						<YoutubeLogo size={19} />
					</a>
				</div>
			</div>

			<nav aria-label="Shop" class="min-w-0">
				<h3 class="text-sm font-bold tracking-widest text-white/40 uppercase">Shop</h3>
				<ul class="mt-3 space-y-1 text-sm">
					<li><a href="/shop" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">All Sneakers</a></li>
					<li><a href="/new-arrivals" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">New Arrivals</a></li>
					<li><a href="/deals" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Deals &amp; Offers</a></li>
					<li><a href="/categories" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Categories</a></li>
					<li><a href="/drops" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Drop Calendar</a></li>
					<li><a href="/gift-cards" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Gift Cards</a></li>
					<li><a href="/blog" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">The Run Down</a></li>
					<li><a href="/cart" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Your Cart</a></li>
					<li><a href="/wishlist" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Wishlist</a></li>
				</ul>
			</nav>

			<nav aria-label="Help" class="min-w-0">
				<h3 class="text-sm font-bold tracking-widest text-white/40 uppercase">Help</h3>
				<ul class="mt-3 space-y-1 text-sm">
					<li><a href="/help" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Help Centre</a></li>
					<li><a href="/shipping" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Shipping</a></li>
					<li><a href="/returns" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Returns</a></li>
					<li><a href="/size-guide" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Size Guide</a></li>
					<li><a href="/fit-finder" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Fit Finder</a></li>
					<li><a href="/track" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Track Order</a></li>
					<li><a href="/accessibility" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Accessibility</a></li>
					<li><a href="/privacy" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Privacy Policy</a></li>
					<li><a href="/terms" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Terms</a></li>
				</ul>
			</nav>

			<nav aria-label="Company" class="min-w-0">
				<h3 class="text-sm font-bold tracking-widest text-white/40 uppercase">Company</h3>
				<ul class="mt-3 space-y-1 text-sm">
					<li><a href="/about" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">About Us</a></li>
					<li><a href="/about#story" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Our Story</a></li>
					<li><a href="/about#stores" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Stores</a></li>
					<li><a href="/account" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Account</a></li>
					<li><a href="/rewards" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Rewards</a></li>
					<li><a href="/signin" class="flex min-h-11 items-center text-white/70 transition-colors hover:text-white">Sign In</a></li>
				</ul>
			</nav>

			<div class="min-w-0">
				<h3 class="text-sm font-bold tracking-widest text-white/40 uppercase">Stay in the loop</h3>
				<p class="mt-4 text-sm text-white/60">Drops, deals and restocks — once a week, no spam.</p>
				{#if subscribed}
					<p class="mt-4 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium">
						<Check size={18} class="text-brand-400" weight="bold" /> You are on the list. Welcome!
					</p>
				{:else}
					<form class="mt-4 flex overflow-hidden rounded-full bg-white/10 p-1 focus-within:ring-2 focus-within:ring-brand-500" onsubmit={subscribe}>
						<label class="sr-only" for="footer-email">Email address</label>
						<input
							id="footer-email"
							type="email"
							required
							bind:value={email}
							placeholder="Email address"
							class="min-w-0 flex-1 bg-transparent px-3 text-base text-white outline-none placeholder:text-white/40"
						/>
						<button type="submit" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 transition-colors hover:bg-brand-400" aria-label="Subscribe">
							<ArrowRight size={18} weight="bold" />
						</button>
					</form>
				{/if}
				<ul class="mt-5 space-y-2 text-sm text-white/60">
					<li class="flex items-center gap-2">
						<Envelope size={16} />
						<a href="mailto:support@shoemate.example" class="hover:text-white">support@shoemate.example</a>
					</li>
					<li class="text-[13px] text-white/40">Demo storefront — this email is a placeholder, not a live inbox.</li>
				</ul>
				<div class="mt-5">
					<label for="footer-currency" class="text-sm font-bold tracking-widest text-white/40 uppercase">Currency</label>
					<select
						id="footer-currency"
						bind:value={currency}
						onchange={setCurrency}
						class="mt-2 flex h-11 w-full max-w-56 items-center rounded-full bg-white/10 px-4 text-base text-white outline-none focus:ring-2 focus:ring-brand-500 [&>option]:text-ink"
					>
						<option value="USD">USD — US Dollar</option>
						<option value="INR">INR — Indian Rupee</option>
						<option value="GBP">GBP — British Pound</option>
					</select>
					<p class="mt-2 text-[13px] leading-relaxed text-white/40">
						Display only for now — prices are shown in USD until multi-currency pricing launches.
					</p>
				</div>
			</div>
		</div>

		<div class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-white/40 sm:flex-row">
			<p>© 2026 Shoemate. All rights reserved. Demo storefront — prices in USD.</p>
			<p>Secure checkout · Free shipping over $150 · 30-day returns</p>
		</div>
	</div>
</footer>
