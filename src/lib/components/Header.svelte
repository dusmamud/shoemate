<script lang="ts">
	import { page } from '$app/state';
	import { ArrowRight, List, MagnifyingGlass, ShoppingBag, Sneaker, User, X } from 'phosphor-svelte';
	import { cart, ui } from '#lib/store.svelte';

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

	$effect(() => {
		// Lock body scroll while the full-height mobile menu is open.
		document.body.style.overflow = ui.menuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<!-- Header lives INSIDE the white sheet (no separate bar, no bottom border). -->
<header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md">
	<div class="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:h-[72px] sm:gap-3 sm:px-6 lg:px-8">
		<a href="/" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-white" aria-label="Shoemate home">
			<Sneaker size={24} weight="fill" />
		</a>

		<nav class="mx-auto hidden items-center gap-1 lg:flex" aria-label="Primary">
			{#each links as link}
				<a
					href={link.href}
					aria-current={isActive(link.href) ? 'page' : undefined}
					class="flex h-11 items-center rounded-full px-3.5 text-sm font-medium transition-colors {isActive(link.href)
						? 'font-semibold text-brand-600'
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
				class="hidden h-11 items-center gap-2 rounded-full bg-mist px-3.5 text-sm text-ink-soft transition-colors hover:bg-peach hover:text-ink sm:flex"
				aria-label="Search products"
			>
				<MagnifyingGlass size={18} />
				<span class="hidden xl:inline">Search Products...</span>
			</button>
			<button
				type="button"
				onclick={() => (ui.searchOpen = true)}
				class="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-mist sm:hidden"
				aria-label="Search products"
			>
				<MagnifyingGlass size={20} />
			</button>

			<a
				href="/signin"
				class="hidden h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:bg-mist sm:flex"
			>
				<User size={19} />
				<span class="hidden md:inline">Sign in</span>
			</a>

			<button
				type="button"
				onclick={() => (ui.cartOpen = true)}
				class="relative flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white transition-colors hover:bg-brand-500"
				aria-label="Open cart, {cart.count} items"
			>
				<ShoppingBag size={20} weight="bold" />
				{#if cart.count}
					<span class="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-xs font-bold text-white ring-2 ring-white">
						{cart.count}
					</span>
				{/if}
			</button>

			<button
				type="button"
				onclick={() => (ui.menuOpen = !ui.menuOpen)}
				class="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-mist lg:hidden"
				aria-label={ui.menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={ui.menuOpen}
				aria-controls="mobile-menu"
			>
				{#if ui.menuOpen}
					<X size={22} />
				{:else}
					<List size={22} />
				{/if}
			</button>
		</div>
	</div>
</header>

<!-- Mobile menu: full-height fixed panel (a sibling of <header>, NOT inside it —
     the header's backdrop-blur would trap fixed positioning). Safe-area aware. -->
{#if ui.menuOpen}
	<nav
		id="mobile-menu"
		class="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-line bg-white px-4 pt-2 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:top-[72px] lg:hidden"
		aria-label="Mobile"
	>
		<ul class="flex flex-col">
			{#each links as link}
				<li>
					<a
						href={link.href}
						aria-current={isActive(link.href) ? 'page' : undefined}
						class="flex min-h-12 items-center justify-between rounded-xl px-3 text-[15px] font-medium {isActive(link.href)
							? 'bg-brand-50 font-semibold text-brand-600'
							: 'hover:bg-mist'}"
					>
						{link.label}
						<ArrowRight size={18} class="text-ink-soft" />
					</a>
				</li>
			{/each}
			<li class="mt-2 border-t border-line pt-2">
				<a href="/signin" class="flex min-h-12 items-center gap-2 rounded-xl px-3 text-[15px] font-medium hover:bg-mist">
					<User size={19} /> Sign in
				</a>
			</li>
		</ul>
	</nav>
{/if}
