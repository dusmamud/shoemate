<script lang="ts">
	import { page } from '$app/state';
	import { Heart, List, MagnifyingGlass, ShoppingBag, Sneaker, User, X } from 'phosphor-svelte';
	import { cart, ui, wishlist } from '#lib/store.svelte';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/shop', label: 'Shop' },
		{ href: '/categories', label: 'Categories' },
		{ href: '/new-arrivals', label: 'New Arrivals' },
		{ href: '/deals', label: 'Deals' },
		{ href: '/about', label: 'About' }
	];

	function isActive(href: string) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}

	$effect(() => {
		// Close the mobile menu whenever the route changes.
		void page.url.pathname;
		ui.menuOpen = false;
	});
</script>

<header class="sticky top-0 z-40 border-b border-line/70 bg-white/90 backdrop-blur-md">
	<div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
		<a href="/" class="flex shrink-0 items-center gap-2" aria-label="Shoemate home">
			<span class="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
				<Sneaker size={24} weight="fill" />
			</span>
			<span class="text-lg font-extrabold tracking-tight sm:text-xl">
				SHOE<span class="text-brand-500">MATE</span>
			</span>
		</a>

		<nav class="mx-auto hidden items-center gap-1 lg:flex" aria-label="Primary">
			{#each links as link}
				<a
					href={link.href}
					aria-current={isActive(link.href) ? 'page' : undefined}
					class="rounded-full px-3.5 py-2 text-sm font-medium transition-colors {isActive(link.href)
						? 'bg-brand-50 font-semibold text-brand-600'
						: 'text-ink hover:bg-mist hover:text-ink'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<div class="ml-auto flex items-center gap-1.5 sm:gap-2 lg:ml-0">
			<button
				type="button"
				onclick={() => (ui.searchOpen = true)}
				class="hidden h-10 items-center gap-2 rounded-full bg-mist px-3.5 text-sm text-ink-soft transition-colors hover:bg-peach hover:text-ink sm:flex"
				aria-label="Search products"
			>
				<MagnifyingGlass size={18} />
				<span class="hidden xl:inline">Search products…</span>
			</button>
			<button
				type="button"
				onclick={() => (ui.searchOpen = true)}
				class="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-mist sm:hidden"
				aria-label="Search products"
			>
				<MagnifyingGlass size={20} />
			</button>

			<a
				href="/signin"
				class="hidden h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:bg-mist sm:flex"
			>
				<User size={19} />
				<span class="hidden md:inline">Sign in</span>
			</a>

			<a
				href="/cart"
				class="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-mist"
				aria-label="Wishlist, {wishlist.slugs.length} items"
			>
				<Heart size={20} weight={wishlist.slugs.length ? 'fill' : 'regular'} class={wishlist.slugs.length ? 'text-brand-500' : ''} />
				{#if wishlist.slugs.length}
					<span class="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
						{wishlist.slugs.length}
					</span>
				{/if}
			</a>

			<button
				type="button"
				onclick={() => (ui.cartOpen = true)}
				class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white transition-colors hover:bg-brand-500"
				aria-label="Open cart, {cart.count} items"
			>
				<ShoppingBag size={20} weight="bold" />
				{#if cart.count}
					<span class="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">
						{cart.count}
					</span>
				{/if}
			</button>

			<button
				type="button"
				onclick={() => (ui.menuOpen = !ui.menuOpen)}
				class="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-mist lg:hidden"
				aria-label={ui.menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={ui.menuOpen}
			>
				{#if ui.menuOpen}
					<X size={22} />
				{:else}
					<List size={22} />
				{/if}
			</button>
		</div>
	</div>

	{#if ui.menuOpen}
		<nav class="border-t border-line bg-white px-4 py-3 lg:hidden" aria-label="Mobile">
			<ul class="flex flex-col">
				{#each links as link}
					<li>
						<a
							href={link.href}
							aria-current={isActive(link.href) ? 'page' : undefined}
							class="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium {isActive(link.href)
								? 'bg-brand-50 font-semibold text-brand-600'
								: 'hover:bg-mist'}"
						>
							{link.label}
							<span class="text-ink-soft">→</span>
						</a>
					</li>
				{/each}
				<li>
					<a href="/signin" class="flex items-center gap-2 rounded-xl px-3 py-3 text-[15px] font-medium hover:bg-mist">
						<User size={19} /> Sign in
					</a>
				</li>
			</ul>
		</nav>
	{/if}
</header>
