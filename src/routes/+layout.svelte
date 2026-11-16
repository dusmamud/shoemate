<script lang="ts">
	import '@fontsource/poppins/400.css';
	import '@fontsource/poppins/500.css';
	import '@fontsource/poppins/600.css';
	import '@fontsource/poppins/700.css';
	import '@fontsource/poppins/800.css';
	import '#lib/app.css';
	import favicon from '#lib/assets/favicon.svg';
	import CartDrawer from '#lib/components/CartDrawer.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Header from '#lib/components/Header.svelte';
	import SearchOverlay from '#lib/components/SearchOverlay.svelte';
	import type { LayoutProps } from './$types';

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
<div class="flex min-h-dvh flex-col bg-white">
	<Header />
	<main class="mx-auto w-full max-w-7xl flex-1 px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
		{@render children()}
	</main>
	<Footer />
</div>

<CartDrawer />
<SearchOverlay />
