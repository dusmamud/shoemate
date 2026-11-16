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

<div class="flex min-h-dvh flex-col">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>

<CartDrawer />
<SearchOverlay />
