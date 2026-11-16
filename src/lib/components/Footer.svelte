<script lang="ts">
	import { ArrowRight, Check, Envelope, FacebookLogo, InstagramLogo, MapPin, Phone, Sneaker, XLogo, YoutubeLogo } from 'phosphor-svelte';

	let email = $state('');
	let subscribed = $state(false);

	function subscribe(e: SubmitEvent) {
		e.preventDefault();
		if (!email.includes('@')) return;
		subscribed = true;
	}
</script>

<footer class="mt-20 bg-ink text-white">
	<div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
		<div class="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
			<div>
				<a href="/" class="flex items-center gap-2" aria-label="Shoemate home">
					<span class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
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
					<a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-500">
						<InstagramLogo size={19} />
					</a>
					<a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-500">
						<FacebookLogo size={19} />
					</a>
					<a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-500">
						<XLogo size={19} />
					</a>
					<a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-500">
						<YoutubeLogo size={19} />
					</a>
				</div>
			</div>

			<nav aria-label="Shop">
				<h3 class="text-sm font-bold tracking-widest text-white/40 uppercase">Shop</h3>
				<ul class="mt-4 space-y-2.5 text-sm">
					<li><a href="/shop" class="text-white/70 transition-colors hover:text-white">All Sneakers</a></li>
					<li><a href="/new-arrivals" class="text-white/70 transition-colors hover:text-white">New Arrivals</a></li>
					<li><a href="/deals" class="text-white/70 transition-colors hover:text-white">Deals &amp; Offers</a></li>
					<li><a href="/categories" class="text-white/70 transition-colors hover:text-white">Categories</a></li>
					<li><a href="/cart" class="text-white/70 transition-colors hover:text-white">Your Cart</a></li>
				</ul>
			</nav>

			<nav aria-label="Company">
				<h3 class="text-sm font-bold tracking-widest text-white/40 uppercase">Company</h3>
				<ul class="mt-4 space-y-2.5 text-sm">
					<li><a href="/about" class="text-white/70 transition-colors hover:text-white">About Us</a></li>
					<li><a href="/about#story" class="text-white/70 transition-colors hover:text-white">Our Story</a></li>
					<li><a href="/about#stores" class="text-white/70 transition-colors hover:text-white">Stores</a></li>
					<li><a href="/signin" class="text-white/70 transition-colors hover:text-white">Sign In</a></li>
				</ul>
			</nav>

			<div>
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
							class="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/40"
						/>
						<button type="submit" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 transition-colors hover:bg-brand-400" aria-label="Subscribe">
							<ArrowRight size={18} weight="bold" />
						</button>
					</form>
				{/if}
				<ul class="mt-5 space-y-2 text-sm text-white/60">
					<li class="flex items-center gap-2"><Envelope size={16} /> hello@shoemate.store</li>
					<li class="flex items-center gap-2"><Phone size={16} /> +1 (555) 014-8890</li>
					<li class="flex items-center gap-2"><MapPin size={16} /> 214 Runner Street, Portland, OR</li>
				</ul>
			</div>
		</div>

		<div class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[13px] text-white/40 sm:flex-row">
			<p>© 2026 Shoemate. All rights reserved. Demo storefront — prices in USD.</p>
			<p>Secure checkout · Free shipping over $150 · 30-day returns</p>
		</div>
	</div>
</footer>
