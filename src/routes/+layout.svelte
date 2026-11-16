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

<!-- One continuous white sheet (header + page) on the cream page, like the reference:
     the hero is NOT in its own box — it sits on this sheet, as do all sections. -->
<div class="flex min-h-dvh flex-col">
	<div class="flex w-full flex-1 flex-col px-4 pt-5 sm:px-6 sm:pt-8 lg:px-8 lg:pt-20">
		<div class="mx-auto mb-4 flex w-full max-w-[1216px] flex-1 flex-col rounded-[1.5rem] bg-white shadow-card sm:mb-6 lg:mb-10">
			<Header />
			<main class="flex-1 px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
				{@render children()}
			</main>
		</div>
	</div>
	<Footer />
</div>

<CartDrawer />
<SearchOverlay />
