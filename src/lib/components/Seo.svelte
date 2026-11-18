<script lang="ts">
	import { page } from '$app/state';

	/**
	 * Seo — the single source of per-page head metadata.
	 *
	 * Every route renders exactly one <Seo> inside its <svelte:head> (or as a
	 * top-level component — SvelteKit hoists its <svelte:head> output). It emits
	 * exactly ONE <title>, ONE description, ONE Open Graph set, ONE canonical
	 * link, and a robots noindex ONLY when asked. There is no generic fallback
	 * meta left in app.html or +layout.svelte, so a page without <Seo> has no
	 * description/OG/canonical at all — wire it into every route (Wave B).
	 *
	 * Usage:
	 *   <Seo title="Shop — Shoemate" description="..." />
	 *   <Seo title="Nike Air Max Dn" description="..." ogType="product"
	 *        ogImage="/images/prod-airmax.png" />
	 *   <Seo title="Cart" description="..." noindex />
	 *   <Seo title="..." description="..." canonical="https://shoemate.pages.dev/shop/" />
	 */
	interface Props {
		/** Page title — also used for og:title and twitter:title. */
		title: string;
		/** Page description — also used for og:description and twitter:description. */
		description: string;
		/** og:type. 'product' for PDPs, 'website' everywhere else. */
		ogType?: 'website' | 'product';
		/**
		 * og:image / twitter:image. Relative paths are prefixed with the site
		 * origin. Default is the home OG JPG (1200×630, JPG/PNG only — never
		 * WebP/AVIF, scrapers handle those unreliably).
		 */
		ogImage?: string;
		/**
		 * Absolute canonical URL. When omitted it is derived from the current
		 * pathname: query string stripped, trailing slash forced, prefixed
		 * with https://shoemate.pages.dev.
		 */
		canonical?: string;
		/** When true, emits <meta name="robots" content="noindex, follow">. */
		noindex?: boolean;
		/**
		 * PDP only: product price (USD). When set, emits the three
		 * product:price / product:availability metas. These live HERE,
		 * inside Seo's own head template — they must NOT be written as
		 * sibling elements after <Seo> in a page's <svelte:head>: the
		 * compiler locates such post-component siblings with a hydration
		 * sibling-walk that runs past the end of the head node list and
		 * crashes the whole page on mount (Illegal invocation, 2026-11-18).
		 */
		productPrice?: number;
		/** PDP only: 'in stock' / 'out of stock'. Only used with productPrice. */
		productAvailability?: 'in stock' | 'out of stock';
	}

	let {
		title,
		description,
		ogType = 'website',
		ogImage = '/images/og-hero-sneaker.jpg',
		canonical,
		noindex = false,
		productPrice,
		productAvailability = 'in stock'
	}: Props = $props();

	const SITE = 'https://shoemate.pages.dev';

	const canonicalUrl = $derived.by(() => {
		if (canonical) return canonical;
		let path = page.url.pathname;
		if (!path.endsWith('/')) path += '/';
		return `${SITE}${path}`;
	});

	const ogImageUrl = $derived(
		ogImage.startsWith('http') ? ogImage : `${SITE}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:type" content={ogType} />
	<meta property="og:site_name" content="Shoemate" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={ogImageUrl} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImageUrl} />
	<link rel="canonical" href={canonicalUrl} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{/if}
	{#if productPrice !== undefined}
		<meta property="product:price:amount" content={String(productPrice)} />
		<meta property="product:price:currency" content="USD" />
		<meta property="product:availability" content={productAvailability} />
	{/if}
</svelte:head>
