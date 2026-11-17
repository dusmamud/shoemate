<script lang="ts">
	import '@fontsource/poppins/400.css';
	import '@fontsource/poppins/500.css';
	import '@fontsource/poppins/600.css';
	import '@fontsource/poppins/700.css';
	import '@fontsource/poppins/800.css';
	import '#lib/app.css';
	import favicon from '#lib/assets/favicon.svg';
	import CartDrawer from '#lib/components/CartDrawer.svelte';
	import CookieNotice from '#lib/components/CookieNotice.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Header from '#lib/components/Header.svelte';
	import SearchOverlay from '#lib/components/SearchOverlay.svelte';
	import Toast from '#lib/components/Toast.svelte';
	import { setupViewTransitions } from '#lib/transitions';
	import type { LayoutProps } from './$types';

	setupViewTransitions();

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Shoemate — Premium Sneakers, Fast Delivery</title>
	<meta
		name="description"
		content="Shop the latest premium sneakers with fast delivery and exclusive offers. New arrivals, bestsellers and limited drops — only at Shoemate."
	/>
	<meta name="theme-color" content="#ff6b1a" />
</svelte:head>

<!-- Full-bleed white page — no frame/gap on any side. The hero sits directly
     on the page (no separate card), as do all sections. -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
>
	Skip to content
</a>
<div class="flex min-h-dvh flex-col overflow-x-clip bg-white">
	<Header />
	<main id="main-content" class="mx-auto w-full max-w-7xl flex-1 px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
		{@render children()}
	</main>
	<Footer />
</div>

<CartDrawer />
<SearchOverlay />
<CookieNotice />
<Toast />
