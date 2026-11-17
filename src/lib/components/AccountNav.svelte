<script lang="ts">
	import { page } from '$app/state';
	import { Gift, Heart, MagnifyingGlass, MapPin, Package, Sparkle, User } from 'phosphor-svelte';

	const links = [
		{ href: '/account', label: 'Overview', icon: User },
		{ href: '/account/orders', label: 'Orders', icon: Package },
		{ href: '/account/addresses', label: 'Addresses', icon: MapPin },
		{ href: '/rewards', label: 'Rewards', icon: Sparkle },
		{ href: '/wishlist', label: 'Wishlist', icon: Heart },
		{ href: '/gift-cards', label: 'Gift cards', icon: Gift },
		{ href: '/track', label: 'Track order', icon: MagnifyingGlass }
	];

	let current = $derived(page.url.pathname.replace(/\/$/, '') || '/');
</script>

<nav aria-label="Account" class="nice-scroll -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
	{#each links as link (link.href)}
		{@const active = current === link.href}
		<a
			href={link.href}
			aria-current={active ? 'page' : undefined}
			class="flex h-11 shrink-0 items-center gap-2.5 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 {active
				? 'bg-ink text-white'
				: 'bg-white text-ink-soft shadow-card hover:text-ink'}"
		>
			<link.icon size={18} weight={active ? 'fill' : 'regular'} /> {link.label}
		</a>
	{/each}
</nav>
