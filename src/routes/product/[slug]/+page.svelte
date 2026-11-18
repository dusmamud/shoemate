<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { browser } from '$app/env';
	import {
		ArrowCounterClockwise,
		ArrowRight,
		Bell,
		CaretLeft,
		CaretRight,
		Check,
		Heart,
		Link as LinkIcon,
		MagnifyingGlassMinus,
		MagnifyingGlassPlus,
		MapPin,
		Minus,
		Play,
		Plus,
		Question,
		ShareNetwork,
		ShieldCheck,
		ShoppingBag,
		Star,
		Truck,
		X
	} from 'phosphor-svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import { jpegSrc, responsiveImage } from '#lib/images';
	import RecentlyViewed from '#lib/components/RecentlyViewed.svelte';
	import Reveal from '#lib/components/Reveal.svelte';
	import { focusTrap } from '#lib/focus-trap';
	import { recordView } from '#lib/recently-viewed';
	import {
		DEMO_STORES,
		SIZE_TABLE,
		completeTheLook,
		getProduct,
		ratingDistribution,
		relatedProducts,
		sampleQaFor,
		sampleReviewsFor,
		type SampleQA,
		type SampleReview
	} from '#lib/data/products';
	import { cart, ui, wishlist } from '#lib/store.svelte';
	import { waitlist } from '#lib/waitlist.svelte';

	const product = $derived(getProduct(page.params.slug ?? ''));
	const related = $derived(product ? relatedProducts(product.slug) : []);
	const look = $derived(product ? completeTheLook(product.slug) : []);
	const distribution = $derived(product ? ratingDistribution(product) : []);
	const sampleReviews = $derived(product ? sampleReviewsFor(product.slug) : []);
	const sampleQas = $derived(product ? sampleQaFor(product.slug) : []);

	// Recently viewed (S-01 / F-08): record during script init, BEFORE the
	// <RecentlyViewed> child mounts and reads localStorage — recording in
	// $effect was always one visit late, so the current product was absent
	// from its own rail on first visit. Guarded: no-op during SSR/prerender.
	// Reads the slug straight from `page` (not the `product` $derived) so
	// the compiler does not flag a local-state read at init time.
	try {
		if (browser) {
			const p = getProduct(page.params.slug ?? '');
			if (p) recordView(p.slug);
		}
	} catch {
		// Recently-viewed is best-effort; never break the PDP.
	}

	let size = $state<string | null>(null);
	let colour = $state<string | null>(null);
	let qty = $state(1);
	let sizeError = $state(false);
	let justAdded = $state(false);

	// Gallery
	let activeImage = $state(0);
	let galleryEl: HTMLDivElement | null = $state(null);
	let lightboxOpen = $state(false);
	let lightboxCloseBtn: HTMLButtonElement | null = $state(null);

	// Lightbox magnify/pan zoom (F-15b, desktop): click toggles 2× zoom,
	// drag pans while zoomed. Transform-only; no motion under reduced motion
	// (see the scoped <style> at the bottom of this file).
	const ZOOM_SCALE = 2;
	let zoomed = $state(false);
	let panX = $state(0);
	let panY = $state(0);
	let zoomImg: HTMLImageElement | null = $state(null);
	let dragStart: { x: number; y: number; panX: number; panY: number } | null = null;
	let dragMoved = false;

	function resetZoom() {
		zoomed = false;
		panX = 0;
		panY = 0;
		dragStart = null;
	}

	function toggleZoom() {
		zoomed = !zoomed;
		if (!zoomed) {
			panX = 0;
			panY = 0;
		}
	}

	function onZoomPointerDown(e: PointerEvent) {
		if (!zoomed) return;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		dragStart = { x: e.clientX, y: e.clientY, panX, panY };
		dragMoved = false;
	}

	function onZoomPointerMove(e: PointerEvent) {
		if (!dragStart || !zoomImg) return;
		const dx = e.clientX - dragStart.x;
		const dy = e.clientY - dragStart.y;
		if (Math.abs(dx) + Math.abs(dy) > 4) dragMoved = true;
		// Images are square; the displayed content is the min(clientW, clientH)
		// square, so clamp the pan so the photo cannot be dragged out of view.
		const shown = Math.min(zoomImg.clientWidth, zoomImg.clientHeight);
		const max = (shown * (ZOOM_SCALE - 1)) / 2;
		panX = Math.max(-max, Math.min(max, dragStart.panX + dx));
		panY = Math.max(-max, Math.min(max, dragStart.panY + dy));
	}

	function onZoomPointerUp() {
		dragStart = null;
	}

	function onZoomClick() {
		// A drag that moved is a pan, not a zoom toggle.
		if (dragMoved) {
			dragMoved = false;
			return;
		}
		toggleZoom();
	}

	// Size guide modal
	let sizeGuideOpen = $state(false);
	let sizeGuideCloseBtn: HTMLButtonElement | null = $state(null);

	// Per-size stock (M-03 / M-04)
	const selectedStock = $derived(
		product && size ? (product.sizeStock.find((s) => s.size === size)?.stock ?? 0) : null
	);
	const selectedColour = $derived(product?.colours.find((c) => c.name === colour) ?? product?.colours[0]);

	// Gallery images (F-16): when the selected colourway has its own photo,
	// it replaces the main shot (index 0); the other angles stay shared.
	// Colourways without their own photo keep the default gallery.
	const galleryImages = $derived(
		product
			? selectedColour?.image
				? [selectedColour.image, ...product.images.slice(1)]
				: product.images
			: []
	);
	const hasAltColourImage = $derived(product?.colours.some((c) => c.image) ?? false);

	// Back-in-stock waitlist (M-19)
	let waitlistEmail = $state('');
	let waitlistDone = $state(false);
	let waitlistError = $state('');

	// Delivery estimate (S-04)
	let zip = $state('');
	let deliveryDate = $state<Date | null>(null);
	let deliveryError = $state('');

	// Share (N-04)
	let shareCopied = $state(false);

	// Reviews (M-01) — user reviews live only in this browser's localStorage
	interface LocalReview {
		author: string;
		rating: number;
		title: string;
		body: string;
		date: string;
	}
	let userReviews = $state<LocalReview[]>([]);
	let reviewName = $state('');
	let reviewRating = $state(5);
	let reviewTitle = $state('');
	let reviewBody = $state('');
	let reviewDone = $state(false);
	let reviewError = $state('');

	// Q&A (N-03)
	interface LocalQA {
		q: string;
		author: string;
		date: string;
	}
	let userQas = $state<LocalQA[]>([]);
	let qaName = $state('');
	let qaQuestion = $state('');
	let qaDone = $state(false);
	let qaError = $state('');

	$effect(() => {
		if (!product) return;
		// Re-record on client-side PDP → PDP navigation, where script init
		// does not re-run (the rail itself only reads on mount, so this
		// keeps localStorage correct for the next page that mounts it).
		try {
			recordView(product.slug);
		} catch {
			// Best-effort only.
		}
		if (!colour) colour = product.colours[0]?.name ?? null;
		try {
			userReviews = JSON.parse(localStorage.getItem(`shoemate:reviews:${product.slug}`) ?? '[]') as LocalReview[];
			userQas = JSON.parse(localStorage.getItem(`shoemate:qa:${product.slug}`) ?? '[]') as LocalQA[];
		} catch {
			userReviews = [];
			userQas = [];
		}
	});

	// Focus return for the modals (F-13, same pattern as CartDrawer /
	// SearchOverlay): remember what opened the dialog, focus it back on close.
	let modalTrigger: HTMLElement | null = null;

	// Escape closes either modal; lock body scroll while a modal is open.
	$effect(() => {
		if (!lightboxOpen && !sizeGuideOpen) return;
		if (!modalTrigger) modalTrigger = document.activeElement as HTMLElement | null;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				resetZoom();
				lightboxOpen = false;
				sizeGuideOpen = false;
			}
			if (lightboxOpen && e.key === 'ArrowRight') stepImage(1);
			if (lightboxOpen && e.key === 'ArrowLeft') stepImage(-1);
		};
		window.addEventListener('keydown', onKey);
		document.body.style.overflow = 'hidden';
		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = '';
			modalTrigger?.focus?.();
			modalTrigger = null;
		};
	});

	// Initial focus into the open dialog (kept separate so the modal effect
	// above only tracks the open flags — otherwise bind:this re-runs it and
	// the return-focus capture would grab the close button itself).
	$effect(() => {
		if (lightboxOpen) lightboxCloseBtn?.focus();
		if (sizeGuideOpen) sizeGuideCloseBtn?.focus();
	});

	// Closing the lightbox always exits zoom.
	$effect(() => {
		if (!lightboxOpen) resetZoom();
	});

	function onGalleryScroll() {
		if (!galleryEl) return;
		const idx = Math.round(galleryEl.scrollLeft / Math.max(1, galleryEl.clientWidth));
		if (idx !== activeImage) activeImage = idx;
	}

	function goToImage(i: number) {
		resetZoom();
		activeImage = i;
		galleryEl?.scrollTo({ left: i * galleryEl.clientWidth, behavior: 'smooth' });
	}

	function stepImage(dir: 1 | -1) {
		if (!product) return;
		const n = galleryImages.length;
		goToImage((activeImage + dir + n) % n);
	}

	function openLightbox() {
		// Lightbox is a desktop pattern; on mobile the gallery is swipeable instead.
		if (!window.matchMedia('(min-width: 1024px)').matches) return;
		lightboxOpen = true;
	}

	function addToCart(openDrawer = true) {
		if (!product) return;
		if (!size) {
			sizeError = true;
			document.getElementById('size-heading')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}
		if (selectedStock === 0) return;
		cart.add(product.slug, size, qty, colour ?? undefined);
		justAdded = true;
		setTimeout(() => (justAdded = false), 1600);
		if (openDrawer) ui.cartOpen = true;
	}

	function buyNow() {
		if (!product || !size) {
			sizeError = true;
			return;
		}
		if (selectedStock === 0) return;
		cart.add(product.slug, size, qty, colour ?? undefined);
		goto('/checkout');
	}

	function submitWaitlist() {
		if (!product || !size) return;
		const email = waitlistEmail.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			waitlistError = 'Enter a valid email address.';
			return;
		}
		waitlist.add(product.slug, size, email);
		waitlistError = '';
		waitlistDone = true;
	}

	function addBusinessDays(from: Date, days: number): Date {
		const d = new Date(from);
		let added = 0;
		while (added < days) {
			d.setDate(d.getDate() + 1);
			const day = d.getDay();
			if (day !== 0 && day !== 6) added++;
		}
		return d;
	}

	function checkDelivery() {
		const z = zip.trim();
		if (!/^\d{5}$/.test(z) && !/^\d{6}$/.test(z)) {
			deliveryError = 'Enter a 5-digit ZIP code or 6-digit pincode.';
			deliveryDate = null;
			return;
		}
		deliveryError = '';
		deliveryDate = addBusinessDays(new Date(), 3);
	}

	async function shareProduct() {
		if (!product) return;
		const url = `https://shoemate.pages.dev/product/${product.slug}`;
		if (navigator.share) {
			try {
				await navigator.share({ title: product.name, text: product.blurb, url });
				return;
			} catch {
				// User dismissed the share sheet — fall through to copy link.
			}
		}
		try {
			await navigator.clipboard.writeText(url);
			shareCopied = true;
			setTimeout(() => (shareCopied = false), 2500);
		} catch {
			// Clipboard unavailable (e.g. non-secure context) — nothing more to do.
		}
	}

	function submitReview() {
		if (!product) return;
		if (!reviewName.trim() || !reviewTitle.trim() || !reviewBody.trim()) {
			reviewError = 'Fill in your name, a title and your review.';
			return;
		}
		const entry: LocalReview = {
			author: reviewName.trim(),
			rating: reviewRating,
			title: reviewTitle.trim(),
			body: reviewBody.trim(),
			date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
		};
		userReviews = [entry, ...userReviews];
		localStorage.setItem(`shoemate:reviews:${product.slug}`, JSON.stringify(userReviews));
		reviewName = '';
		reviewTitle = '';
		reviewBody = '';
		reviewRating = 5;
		reviewError = '';
		reviewDone = true;
	}

	function submitQuestion() {
		if (!product) return;
		if (!qaName.trim() || !qaQuestion.trim()) {
			qaError = 'Fill in your name and your question.';
			return;
		}
		const entry: LocalQA = {
			q: qaQuestion.trim(),
			author: qaName.trim(),
			date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
		};
		userQas = [entry, ...userQas];
		localStorage.setItem(`shoemate:qa:${product.slug}`, JSON.stringify(userQas));
		qaName = '';
		qaQuestion = '';
		qaError = '';
		qaDone = true;
	}

	/** Deterministic demo per-store availability for the selected size. */
	function storeAvailability(city: string): 'in' | 'low' | 'out' {
		if (!product || !size) return 'in';
		const hash = [...(product.slug + city + size)].reduce((n, ch) => n + ch.charCodeAt(0), 0);
		if (hash % 4 === 0) return 'out';
		if (hash % 5 === 0) return 'low';
		return 'in';
	}

	const jsonLd = $derived(
		product
			? {
					'@context': 'https://schema.org',
					'@type': 'Product',
					name: product.name,
					brand: { '@type': 'Brand', name: product.brand },
					description: product.description,
					// All gallery angles as 1200px JPEGs (scrapers / JSON-LD
					// consumers handle JPG reliably; never WebP here).
					image: product.images.map((img) => `https://shoemate.pages.dev${jpegSrc(img)}`),
					// Internal merchant identifier, derived from the slug —
					// not an invented gtin/mpn.
					sku: `SM-${product.slug.toUpperCase()}`,
					category: product.category,
					// aggregateRating KEPT AS-IS (Dus, 2026-11-18: "abhi maat
					// hatana"). The 4.9 / 2,314 numbers are demo data, not real
					// user reviews — the policy risk stays a documented open
					// item; do not remove or change this block.
					aggregateRating: {
						'@type': 'AggregateRating',
						ratingValue: product.rating,
						reviewCount: product.reviews
					},
					offers: {
						'@type': 'Offer',
						url: `https://shoemate.pages.dev/product/${product.slug}/`,
						priceCurrency: 'USD',
						price: product.price,
						availability:
							product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
						// @id references only — the full policies live on
						// their own pages (/returns/#policy, /shipping/#details)
						// and say exactly what is claimed here.
						hasMerchantReturnPolicy: { '@id': 'https://shoemate.pages.dev/returns/#policy' },
						shippingDetails: { '@id': 'https://shoemate.pages.dev/shipping/#details' }
					}
				}
			: null
	);
</script>

<svelte:head>
	<!-- Single unconditional <Seo>: the head must NOT contain an {#if} block
	     wrapping a component. That shape mis-accounts Svelte 5's head
	     hydration cursor — first it crashed the page (Illegal invocation,
	     2026-11-18), then, with the metas moved into Seo, hydration
	     overshot and deleted the page's <link rel="stylesheet"> nodes,
	     unstyling the PDP and blowing the gallery to its 1600px intrinsic
	     width (document overflow 1234px @390). The not-found case is
	     handled with ternaries + noindex instead of a branch. -->
	<Seo
		title={product
			? `${product.name} — $${product.price} · Shoemate`
			: 'Product not found — Shoemate'}
		description={product
			? `${product.name} by ${product.brand}. ${product.blurb} Free shipping over $150 at Shoemate.`
			: 'This product is no longer available at Shoemate — browse the latest sneakers instead.'}
		ogType="product"
		ogImage={product
			? product.image.replace('/images/', '/images/og-').replace('.png', '.jpg')
			: undefined}
		productPrice={product?.price}
		productAvailability={product && product.stock > 0 ? 'in stock' : 'out of stock'}
		noindex={!product}
	/>
</svelte:head>

{#if product}
{#if jsonLd}
			{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
		{/if}
<JsonLd
			data={breadcrumbList([
				{ name: 'Home', href: '/' },
				{ name: 'Shop', href: '/shop/' },
				{ name: product.name }
			])}
		/>
{/if}

{#if product}
	<section class="pt-6">
		<nav aria-label="Breadcrumb" class="text-[13px] text-ink-soft">
			<a href="/" class="inline-flex min-h-11 items-center px-2 hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">Home</a> <span aria-hidden="true">/</span>
			<a href="/shop" class="inline-flex min-h-11 items-center px-2 hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">Shop</a> <span aria-hidden="true">/</span>
			<span class="font-medium text-ink">{product.name}</span>
		</nav>

		<div class="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
			<!-- Gallery: swipeable (scroll-snap) on mobile, click-to-zoom lightbox on desktop -->
			<div class="min-w-0">
				<div class="relative min-w-0 overflow-hidden rounded-[2rem] bg-white shadow-card">
					<div
						bind:this={galleryEl}
						onscroll={onGalleryScroll}
						class="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:snap-none lg:overflow-hidden [&::-webkit-scrollbar]:hidden"
					>
						{#each galleryImages as src, i}
							<button
								type="button"
								onclick={openLightbox}
								aria-label="Zoom image {i + 1} of {galleryImages.length} — {product.name}"
								class="block w-full shrink-0 snap-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
							>
								<img
									src={responsiveImage(src).src}
									srcset={responsiveImage(src).srcset}
									sizes="(max-width: 1023px) 100vw, 600px"
									alt="{product.name} — view {i + 1} of {galleryImages.length}"
									width="1600"
									height="1600"
									style={i === 0 ? `view-transition-name: product-${product.slug}` : undefined}
									class="aspect-square w-full object-cover"
									fetchpriority={i === 0 ? 'high' : undefined}
									loading={i === 0 ? 'eager' : 'lazy'}
									draggable="false"
								/>
							</button>
						{/each}
					</div>
					{#if product.badge}
						<span class="absolute top-4 left-4 rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold tracking-wide text-white uppercase">{product.badge}</span>
					{/if}
					{#if product.oldPrice}
						<span class="absolute top-4 right-4 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-extrabold text-white">
							SAVE ${product.oldPrice - product.price}
						</span>
					{/if}
					<button
						type="button"
						onclick={openLightbox}
						class="absolute right-4 bottom-4 hidden h-11 w-11 items-center justify-center rounded-full bg-white/95 text-ink shadow-md transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 lg:flex"
						aria-label="Zoom product image"
					>
						<MagnifyingGlassPlus size={20} weight="bold" />
					</button>
					{#if galleryImages.length > 1}
						<p class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/45 px-2.5 py-1.5" aria-hidden="true">
							{#each galleryImages as _, i}
								<span class="h-1.5 w-1.5 rounded-full {i === activeImage ? 'bg-white' : 'bg-white/50'}"></span>
							{/each}
						</p>
					{/if}
				</div>
				<div class="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Product images">
					{#each galleryImages as src, i}
						<button
							type="button"
							role="tab"
							aria-selected={activeImage === i}
							aria-label="Show image {i + 1}"
							onclick={() => goToImage(i)}
							class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-white transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 {activeImage === i
								? 'border-ink'
								: 'border-transparent opacity-70 hover:opacity-100'}"
						>
							<img src={responsiveImage(src).src} srcset={responsiveImage(src).srcset} sizes="80px" alt="" width="160" height="160" class="h-full w-full object-cover" loading="lazy" />
						</button>
					{/each}
				</div>
				<p class="mt-1 text-xs text-ink-soft">Swipe through the angles on mobile · tap to zoom on desktop</p>
				{#if product.video}
					<!-- Product video (N-06): only the hero product has a clip in this pass. -->
					<div class="mt-5">
						<p class="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
							<Play size={18} weight="fill" class="text-brand-500" /> See it in motion — 360° view
						</p>
						<video
							src={product.video}
							poster={product.image}
							controls
							muted
							loop
							playsinline
							preload="metadata"
							class="aspect-square w-full rounded-[2rem] bg-white object-cover shadow-card"
							aria-label="{product.name} — 360 degree product video"
						></video>
						<p class="mt-1 text-xs text-ink-soft">10-second spin</p>
					</div>
				{/if}
			</div>

			<div class="min-w-0">
				<div class="flex items-start justify-between gap-3">
					<p class="text-sm font-bold tracking-widest text-brand-500 uppercase">{product.brand} · {product.category}</p>
					<button
						type="button"
						onclick={shareProduct}
						class="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-[13px] font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
						aria-label="Share this product"
					>
						{#if shareCopied}
							<Check size={16} weight="bold" class="text-emerald-600" /> Link copied
						{:else}
							<ShareNetwork size={16} weight="bold" /> Share
						{/if}
					</button>
				</div>
				<h1 class="mt-2 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">{product.name}</h1>
				<p class="mt-2 flex flex-wrap items-center gap-2 text-sm">
					<span class="flex items-center gap-1 font-semibold">
						<Star size={16} weight="fill" class="text-amber-400" /> {product.rating.toFixed(1)}
					</span>
					<a href="#reviews" class="text-ink-soft underline underline-offset-2 hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">({product.reviews.toLocaleString()} reviews)</a>
					<span class="text-ink-soft">·</span>
					<span class={product.stock <= 7 ? 'font-semibold text-red-600' : 'font-medium text-emerald-700'}>
						{product.stock <= 7 ? `Only ${product.stock} left in stock` : 'In stock'}
					</span>
				</p>

				<div class="mt-4 flex flex-wrap items-baseline gap-3">
					<span class="text-3xl font-extrabold">${product.price}</span>
					{#if product.oldPrice}
						<span class="text-lg text-ink-soft line-through">${product.oldPrice}</span>
						<span class="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">
							{Math.round((1 - product.price / product.oldPrice) * 100)}% off
						</span>
					{/if}
				</div>
				<p class="mt-1 text-xs text-ink-soft">or 4 interest-free payments of ${(product.price / 4).toFixed(2)}</p>

				<p class="mt-5 text-[15px] leading-relaxed text-ink-soft">{product.description}</p>

				<div class="mt-7">
					<div class="flex items-center justify-between">
						<h2 id="size-heading" class="text-sm font-bold">Select size <span class="font-normal text-ink-soft">(UK)</span></h2>
						<button
							type="button"
							class="-mx-2 flex min-h-11 items-center px-2 text-[13px] font-medium text-brand-600 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
							onclick={() => (sizeGuideOpen = true)}
						>
							Size guide
						</button>
					</div>
					<div class="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Choose a size">
						{#each product.sizeStock as s}
							<button
								type="button"
								role="radio"
								aria-checked={size === s.size}
								aria-label="{s.size}{s.stock === 0 ? ', out of stock — select to get notified' : s.stock <= 3 ? `, only ${s.stock} left` : ''}"
								onclick={() => {
									size = s.size;
									sizeError = false;
									waitlistDone = false;
								}}
								class="flex h-12 items-center justify-center rounded-2xl border-2 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 {size === s.size
									? 'border-ink bg-ink text-white' + (s.stock === 0 ? ' line-through' : '')
									: s.stock === 0
										? 'border-line bg-mist text-ink-soft line-through hover:border-ink'
										: 'border-line bg-white hover:border-ink'}"
							>
								{s.size}
							</button>
						{/each}
					</div>
					{#if sizeError}
						<p class="mt-2 text-sm font-medium text-red-600" role="alert">Please choose a size first.</p>
					{/if}
					{#if size && selectedStock !== null && selectedStock > 0 && selectedStock <= 3}
						<p class="mt-2 text-sm font-semibold text-red-600" role="status">
							Only {selectedStock} left in {size} — order soon
						</p>
					{/if}
					{#if size && selectedStock === 0}
						<div class="mt-4 rounded-2xl border border-line bg-mist p-4">
							<p class="flex items-center gap-2 text-sm font-bold"><Bell size={17} class="text-brand-500" /> {size} is sold out</p>
							<p class="mt-1 text-sm text-ink-soft">Leave your email and we will let you know when it is back in stock.</p>
							{#if waitlistDone}
								<p class="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-700" role="status">
									<Check size={17} weight="bold" /> You are on the list for {size}. Demo only — no email will be sent.
								</p>
							{:else}
								<form
									class="mt-3 flex flex-col gap-2 sm:flex-row"
									onsubmit={(e) => {
										e.preventDefault();
										submitWaitlist();
									}}
								>
									<label for="waitlist-email" class="sr-only">Email for back-in-stock alert</label>
									<input
										id="waitlist-email"
										type="email"
										bind:value={waitlistEmail}
										placeholder="you@example.com"
										autocomplete="email"
										class="h-12 w-full min-w-0 rounded-full border border-line bg-white px-4 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:flex-1"
									/>
									<button
										type="submit"
										class="flex h-12 shrink-0 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
									>
										Notify me
									</button>
								</form>
								{#if waitlistError}
									<p class="mt-2 text-sm font-medium text-red-600" role="alert">{waitlistError}</p>
								{/if}
								<p class="mt-2 text-xs text-ink-soft">Demo — stored only in this browser, no email is sent.</p>
							{/if}
						</div>
					{/if}
				</div>

				<div class="mt-6">
					<p class="text-sm font-bold">
						Colour{#if selectedColour}<span class="font-normal text-ink-soft"> — {selectedColour.name}</span>{/if}
					</p>
					<div class="mt-2 flex gap-2" role="radiogroup" aria-label="Choose a colour">
						{#each product.colours as c}
							<button
								type="button"
								role="radio"
								aria-checked={colour === c.name}
								aria-label="Colour {c.name}"
								onclick={() => {
									colour = c.name;
									// Show the selected colourway's photo first.
									goToImage(0);
								}}
								class="flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 {colour === c.name
									? 'border-ink ring-2 ring-ink ring-offset-2'
									: 'border-white ring-1 ring-line hover:ring-ink'}"
							>
								<span class="h-8 w-8 rounded-full" style="background: {c.hex}" aria-hidden="true"></span>
							</button>
						{/each}
					</div>
					{#if selectedColour?.image}
						<p class="mt-1.5 text-xs text-ink-soft">Photo shows the {selectedColour.name} pair. Colourways share the same sizes and stock.</p>
					{:else if hasAltColourImage}
						<p class="mt-1.5 text-xs text-ink-soft">Colourways with their own photo show that pair — this colourway shares the default photos. Colourways share the same sizes and stock.</p>
					{:else}
						<p class="mt-1.5 text-xs text-ink-soft">Colourways share the same photos — the images show the {product.colours[0]?.name ?? ''} pair. Colourways share the same sizes and stock.</p>
					{/if}
				</div>

				<div class="mt-7 flex flex-wrap items-center gap-3">
					<div class="flex items-center rounded-full border border-line bg-white">
						<button
							type="button"
							disabled={qty <= 1}
							onclick={() => (qty = Math.max(1, qty - 1))}
							class="flex h-12 w-11 items-center justify-center rounded-full transition-opacity focus-visible:outline-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
							aria-label="Decrease quantity"
						>
							<Minus size={17} weight="bold" />
						</button>
						<span class="w-8 text-center font-bold" aria-live="polite">{qty}</span>
						<button
							type="button"
							disabled={qty >= 9}
							onclick={() => (qty = Math.min(9, qty + 1))}
							class="flex h-12 w-11 items-center justify-center rounded-full transition-opacity focus-visible:outline-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
							aria-label="Increase quantity"
						>
							<Plus size={17} weight="bold" />
						</button>
					</div>
					<button
						type="button"
						disabled={size !== null && selectedStock === 0}
						onclick={() => addToCart(true)}
						class="order-3 flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50 sm:order-none sm:w-auto sm:flex-1 {justAdded
							? 'bg-emerald-600'
							: 'bg-ink hover:bg-brand-500'}"
					>
						{#if justAdded}
							<Check size={18} weight="bold" /> Added to cart
						{:else}
							<ShoppingBag size={18} weight="bold" /> Add to cart — ${product.price * qty}
						{/if}
					</button>
					<button
						type="button"
						onclick={() => wishlist.toggle(product.slug)}
						aria-pressed={wishlist.has(product.slug)}
						aria-label="Toggle wishlist"
						class="order-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:order-none {wishlist.has(product.slug)
							? 'text-brand-500'
							: ''}"
					>
						<Heart size={20} weight={wishlist.has(product.slug) ? 'fill' : 'regular'} />
					</button>
				</div>
				<button
					type="button"
					disabled={size !== null && selectedStock === 0}
					onclick={buyNow}
					class="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Buy it now <ArrowRight size={17} weight="bold" />
				</button>

				<!-- Delivery estimate (S-04) -->
				<div class="mt-6 rounded-3xl border border-line bg-white p-5">
					<p class="flex items-center gap-2 text-sm font-bold"><Truck size={18} class="text-brand-500" /> Delivery estimate</p>
					<form
						class="mt-3 flex flex-col gap-2 sm:flex-row"
						onsubmit={(e) => {
							e.preventDefault();
							checkDelivery();
						}}
					>
						<label for="delivery-zip" class="sr-only">ZIP code or pincode</label>
						<input
							id="delivery-zip"
							type="text"
							inputmode="numeric"
							bind:value={zip}
							placeholder="ZIP / pincode (e.g. 97204)"
							class="h-12 w-full min-w-0 rounded-full border border-line bg-white px-4 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:flex-1"
						/>
						<button
							type="submit"
							class="flex h-12 shrink-0 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
						>
							Check
						</button>
					</form>
					{#if deliveryError}
						<p class="mt-2 text-sm font-medium text-red-600" role="alert">{deliveryError}</p>
					{/if}
					{#if deliveryDate}
						<p class="mt-2 text-sm font-semibold text-emerald-700" role="status">
							Estimated delivery by {deliveryDate.toLocaleDateString('en-US', {
								weekday: 'long',
								month: 'long',
								day: 'numeric'
							})}
						</p>
					{/if}
					<p class="mt-1.5 text-xs text-ink-soft">Estimate only — standard 2–4 business days, not a live carrier quote.</p>
				</div>

				<ul class="mt-7 space-y-2.5 border-t border-line pt-5 text-sm">
					<li class="flex items-center gap-2.5"><Truck size={19} class="shrink-0 text-brand-500" /> Free shipping over $150 · arrives in 2–4 days</li>
					<li class="flex items-center gap-2.5"><ArrowCounterClockwise size={19} class="shrink-0 text-brand-500" /> Free 30-day returns, no questions asked</li>
					<li class="flex items-center gap-2.5"><ShieldCheck size={19} class="shrink-0 text-brand-500" /> 100% authentic — verified before dispatch</li>
				</ul>

				<div class="mt-6 divide-y divide-line rounded-3xl border border-line bg-white">
					<details class="px-5 py-4">
						<summary class="min-h-11 cursor-pointer rounded-lg py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">Shipping &amp; delivery</summary>
						<p class="mt-2 text-sm leading-relaxed text-ink-soft">Orders ship within 24 hours from our Portland warehouse. Standard delivery is 2–4 business days; express (1–2 days) is available at checkout.</p>
					</details>
					<details class="px-5 py-4">
						<summary class="min-h-11 cursor-pointer rounded-lg py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">Returns &amp; exchanges</summary>
						<p class="mt-2 text-sm leading-relaxed text-ink-soft">Unworn shoes can be returned within 30 days for a full refund or a free size exchange.</p>
					</details>
					<details class="px-5 py-4">
						<summary class="min-h-11 cursor-pointer rounded-lg py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">Materials &amp; care</summary>
						<p class="mt-2 text-sm leading-relaxed text-ink-soft">Spot-clean with a soft brush and mild soap. Air-dry away from direct heat — never machine-wash.</p>
					</details>
				</div>
			</div>
		</div>

		<!-- In-store availability (N-11) -->
		<section class="pt-14" aria-labelledby="in-store-heading">
			<h2 id="in-store-heading" class="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">Check in-store availability</h2>
			<p class="mt-1 text-sm text-ink-soft">
				Demo store list — these are sample locations, not real stores. {#if size}Showing stock for {size}.{:else}Select a size above to check that size in each store.{/if}
			</p>
			<div class="mt-5 grid gap-3 sm:grid-cols-3">
				{#each DEMO_STORES as store}
					{@const avail = storeAvailability(store.city)}
					<div class="rounded-3xl border border-line bg-white p-5">
						<p class="flex items-center gap-2 font-bold"><MapPin size={18} class="shrink-0 text-brand-500" /> {store.city}</p>
						<p class="mt-2 text-sm text-ink-soft">{store.address}</p>
						<p class="mt-1 text-sm text-ink-soft">{store.hours}</p>
						<p class="mt-3 text-sm font-semibold {avail === 'in' ? 'text-emerald-700' : avail === 'low' ? 'text-amber-600' : 'text-red-600'}">
							{avail === 'in' ? 'In stock' : avail === 'low' ? 'Low stock — call ahead' : 'Out of stock'}
						</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Reviews (M-01) -->
		<section id="reviews" class="scroll-mt-24 pt-14" aria-labelledby="reviews-heading">
			<h2 id="reviews-heading" class="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">Reviews</h2>
			<div class="mt-5 grid gap-6 lg:grid-cols-[280px_1fr]">
				<div class="rounded-3xl border border-line bg-white p-5">
					<p class="flex items-baseline gap-2">
						<span class="text-4xl font-extrabold">{product.rating.toFixed(1)}</span>
						<span class="flex items-center gap-0.5" aria-label="Rated {product.rating} out of 5">
							{#each [1, 2, 3, 4, 5] as n}
								<Star size={16} weight={n <= Math.round(product.rating) ? 'fill' : 'regular'} class={n <= Math.round(product.rating) ? 'text-amber-400' : 'text-line'} />
							{/each}
						</span>
					</p>
					<p class="mt-1 text-sm text-ink-soft">Based on {product.reviews.toLocaleString()} reviews</p>
					<div class="mt-4 space-y-2">
						{#each distribution as d}
							<div class="flex items-center gap-2 text-sm">
								<span class="w-6 shrink-0 font-semibold">{d.stars}★</span>
								<div class="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-mist" role="img" aria-label="{d.pct}% of reviews are {d.stars} stars">
									<div class="h-full rounded-full bg-amber-400" style="width: {d.pct}%"></div>
								</div>
								<span class="w-9 shrink-0 text-right text-ink-soft">{d.pct}%</span>
							</div>
						{/each}
					</div>
					<p class="mt-3 text-xs text-ink-soft">Distribution is illustrative, derived from the average rating shown.</p>
				</div>
				<div class="space-y-4">
					{#each sampleReviews as r}
						<article class="rounded-3xl border border-line bg-white p-5">
							<div class="flex flex-wrap items-center gap-2">
								<span class="flex items-center gap-0.5" aria-label="Rated {r.rating} out of 5">
									{#each [1, 2, 3, 4, 5] as n}
										<Star size={15} weight={n <= r.rating ? 'fill' : 'regular'} class={n <= r.rating ? 'text-amber-400' : 'text-line'} />
									{/each}
								</span>
								<span class="rounded-full bg-mist px-2.5 py-1 text-xs font-bold text-ink-soft">Sample review</span>
							</div>
							<h3 class="mt-2 font-bold">{r.title}</h3>
							<p class="mt-1 text-sm leading-relaxed text-ink-soft">{r.body}</p>
							<p class="mt-2 text-xs text-ink-soft">{r.author} · {r.date} · sample content, not a verified purchase</p>
						</article>
					{/each}
					{#each userReviews as r}
						<article class="rounded-3xl border border-line bg-white p-5">
							<div class="flex flex-wrap items-center gap-2">
								<span class="flex items-center gap-0.5" aria-label="Rated {r.rating} out of 5">
									{#each [1, 2, 3, 4, 5] as n}
										<Star size={15} weight={n <= r.rating ? 'fill' : 'regular'} class={n <= r.rating ? 'text-amber-400' : 'text-line'} />
									{/each}
								</span>
								<span class="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">Your review · demo</span>
							</div>
							<h3 class="mt-2 font-bold">{r.title}</h3>
							<p class="mt-1 text-sm leading-relaxed text-ink-soft">{r.body}</p>
							<p class="mt-2 text-xs text-ink-soft">{r.author} · {r.date} · stored only in this browser</p>
						</article>
					{/each}
					<details class="rounded-3xl border border-line bg-white p-5">
						<summary class="min-h-11 cursor-pointer rounded-lg py-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">Write a review</summary>
						{#if reviewDone}
							<p class="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-700" role="status">
								<Check size={17} weight="bold" /> Thanks — your review is saved in this browser (demo only).
							</p>
						{:else}
							<form
								class="mt-3 space-y-3"
								onsubmit={(e) => {
									e.preventDefault();
									submitReview();
								}}
							>
								<div>
									<span class="text-sm font-semibold" id="review-rating-label">Your rating</span>
									<div class="mt-1 flex gap-1" role="radiogroup" aria-labelledby="review-rating-label">
										{#each [1, 2, 3, 4, 5] as n}
											<button
												type="button"
												role="radio"
												aria-checked={reviewRating === n}
												aria-label="{n} star{n === 1 ? '' : 's'}"
												onclick={() => (reviewRating = n)}
												class="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
											>
												<Star size={22} weight={n <= reviewRating ? 'fill' : 'regular'} class={n <= reviewRating ? 'text-amber-400' : 'text-line'} />
											</button>
										{/each}
									</div>
								</div>
								<label class="block text-sm font-semibold" for="review-name">Name</label>
								<input id="review-name" type="text" bind:value={reviewName} placeholder="Your name" autocomplete="name" class="h-12 w-full rounded-full border border-line bg-white px-4 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500" />
								<label class="block text-sm font-semibold" for="review-title">Title</label>
								<input id="review-title" type="text" bind:value={reviewTitle} placeholder="Sum it up in a line" class="h-12 w-full rounded-full border border-line bg-white px-4 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500" />
								<label class="block text-sm font-semibold" for="review-body">Review</label>
								<textarea id="review-body" bind:value={reviewBody} rows="4" placeholder="How did they fit? How do they feel?" class="w-full rounded-3xl border border-line bg-white px-4 py-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"></textarea>
								{#if reviewError}
									<p class="text-sm font-medium text-red-600" role="alert">{reviewError}</p>
								{/if}
								<button type="submit" class="flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
									Submit review
								</button>
								<p class="text-xs text-ink-soft">Demo — your review is stored only in this browser and is not published.</p>
							</form>
						{/if}
					</details>
				</div>
			</div>
		</section>

		<!-- Q&A (N-03) -->
		<section class="pt-14" aria-labelledby="qa-heading">
			<h2 id="qa-heading" class="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">Questions &amp; answers</h2>
			<div class="mt-5 space-y-3">
				{#each sampleQas as item}
					<details class="rounded-3xl border border-line bg-white px-5 py-4">
						<summary class="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg py-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
							<Question size={18} class="shrink-0 text-brand-500" /> {item.q}
							<span class="ml-auto shrink-0 rounded-full bg-mist px-2.5 py-1 text-xs font-bold text-ink-soft">Sample Q&amp;A</span>
						</summary>
						<p class="mt-2 text-sm leading-relaxed text-ink-soft">{item.a}</p>
					</details>
				{/each}
				{#each userQas as item}
					<details class="rounded-3xl border border-line bg-white px-5 py-4">
						<summary class="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg py-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
							<Question size={18} class="shrink-0 text-brand-500" /> {item.q}
							<span class="ml-auto shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-600">Your question · demo</span>
						</summary>
						<p class="mt-2 text-sm leading-relaxed text-ink-soft">Thanks for asking — demo questions are stored only in this browser and are not answered by the store yet.</p>
						<p class="mt-1 text-xs text-ink-soft">{item.author} · {item.date}</p>
					</details>
				{/each}
				<details class="rounded-3xl border border-line bg-white px-5 py-4">
					<summary class="min-h-11 cursor-pointer rounded-lg py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">Ask a question</summary>
					{#if qaDone}
						<p class="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-700" role="status">
							<Check size={17} weight="bold" /> Question saved in this browser (demo only).
						</p>
					{:else}
						<form
							class="mt-3 space-y-3"
							onsubmit={(e) => {
								e.preventDefault();
								submitQuestion();
							}}
						>
							<label class="block text-sm font-semibold" for="qa-name">Name</label>
							<input id="qa-name" type="text" bind:value={qaName} placeholder="Your name" autocomplete="name" class="h-12 w-full rounded-full border border-line bg-white px-4 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500" />
							<label class="block text-sm font-semibold" for="qa-question">Your question</label>
							<textarea id="qa-question" bind:value={qaQuestion} rows="3" placeholder="Does this run narrow? Is it good for wide feet?" class="w-full rounded-3xl border border-line bg-white px-4 py-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"></textarea>
							{#if qaError}
								<p class="text-sm font-medium text-red-600" role="alert">{qaError}</p>
							{/if}
							<button type="submit" class="flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
								Ask a question
							</button>
							<p class="text-xs text-ink-soft">Demo — stored only in this browser, no answer is sent.</p>
						</form>
					{/if}
				</details>
			</div>
		</section>

		<!-- Complete the look (S-03) -->
		<section class="pt-14">
			<Reveal>
				<h2 class="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">Complete the look</h2>
				<p class="mt-1 text-sm text-ink-soft">Pairs well with the {product.name} — different styles from the rest of the store.</p>
			</Reveal>
			<div class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
				{#each look as p, i}
					<Reveal delay={i * 60}>
						<ProductCard product={p} />
					</Reveal>
				{/each}
			</div>
		</section>

		<section class="pt-14">
			<Reveal>
				<h2 class="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">You may also like</h2>
			</Reveal>
			<div class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
				{#each related as p, i}
					<Reveal delay={i * 60}>
						<ProductCard product={p} />
					</Reveal>
				{/each}
			</div>
		</section>

		<RecentlyViewed />

		<!-- Sticky mobile buy bar: keeps price + add-to-cart reachable without scrolling back up. Mobile only. (M-06: verified present at 82ca46c — left as-is.) -->
		<div class="sticky bottom-0 z-30 -mx-4 mt-10 border-t border-line bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgb(22_19_15/0.08)] backdrop-blur sm:-mx-6 lg:hidden">
			<div class="flex items-center gap-3">
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-bold">{product.name}</p>
					<p class="text-sm leading-tight">
						<span class="font-extrabold">${product.price}</span>
						{#if product.oldPrice}
							<span class="ml-1.5 font-medium text-ink-soft line-through">${product.oldPrice}</span>
						{/if}
					</p>
				</div>
				<button
					type="button"
					onclick={() => addToCart(true)}
					class="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 {justAdded
						? 'bg-emerald-600'
						: 'bg-ink hover:bg-brand-500'}"
				>
					{#if justAdded}
						<Check size={18} weight="bold" /> Added
					{:else}
						<ShoppingBag size={18} weight="bold" /> Add to cart
					{/if}
				</button>
			</div>
		</div>
	</section>
{:else}
	<section class="pt-20 pb-10 text-center">
		<h1 class="text-3xl font-extrabold">Product not found</h1>
		<p class="mt-2 text-ink-soft">That pair may have sold out or moved. Browse the latest drops instead.</p>
		<a href="/shop" class="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
			Back to shop <ArrowRight size={17} weight="bold" />
		</a>
	</section>
{/if}

<!-- Size guide modal (M-02) -->
{#if product && sizeGuideOpen}
	<div
		class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) sizeGuideOpen = false;
		}}
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="size-guide-title"
			tabindex="-1"
			use:focusTrap
			class="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-card sm:rounded-[2rem]"
		>
			<div class="flex items-start justify-between gap-4">
				<div>
					<h2 id="size-guide-title" class="text-xl font-extrabold">Size guide</h2>
					<p class="mt-1 text-sm text-ink-soft">{product.name} fits true to size for most people.</p>
				</div>
				<button
					type="button"
					bind:this={sizeGuideCloseBtn}
					onclick={() => (sizeGuideOpen = false)}
					aria-label="Close size guide"
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
				>
					<X size={19} weight="bold" />
				</button>
			</div>
			<div class="mt-4 overflow-x-auto">
				<table class="w-full min-w-[420px] text-sm">
					<thead>
						<tr class="border-b border-line text-left text-ink-soft">
							<th class="py-2 pr-2 font-semibold">UK</th>
							<th class="py-2 pr-2 font-semibold">EU</th>
							<th class="py-2 pr-2 font-semibold">US men</th>
							<th class="py-2 font-semibold">Foot length</th>
						</tr>
					</thead>
					<tbody>
						{#each SIZE_TABLE as row}
							<tr class="border-b border-line last:border-0">
								<td class="py-2.5 pr-2 font-bold">{row.uk}</td>
								<td class="py-2.5 pr-2">{row.eu.slice(3)}</td>
								<td class="py-2.5 pr-2">{row.us.slice(3)}</td>
								<td class="py-2.5">{row.cm}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<ul class="mt-4 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft">
				<li>Measure your foot in the evening, standing, heel to longest toe — then match the foot length above.</li>
				<li>Between sizes? Go half a size up.</li>
				<li>Wide feet? Go half a size up or pick a wider model.</li>
			</ul>
			<a
				href="/size-guide"
				class="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
			>
				Full size guide <ArrowRight size={16} weight="bold" />
			</a>
		</div>
	</div>
{/if}

<!-- Image lightbox (M-05, desktop) — with magnify/pan zoom (F-15b) -->
{#if product && lightboxOpen}
	<div
		class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
		role="presentation"
		onclick={(e) => {
			if (e.target === e.currentTarget) lightboxOpen = false;
		}}
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-label="Product image viewer — {product.name}"
			use:focusTrap
			class="flex w-full max-w-4xl flex-col items-center"
		>
			<div class="flex w-full items-center justify-between gap-2">
				<p class="text-sm font-semibold text-white/80">Image {activeImage + 1} of {galleryImages.length}</p>
				<div class="flex items-center gap-2">
					<button
						type="button"
						onclick={toggleZoom}
						aria-pressed={zoomed}
						aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
						class="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>
						{#if zoomed}
							<MagnifyingGlassMinus size={19} weight="bold" />
						{:else}
							<MagnifyingGlassPlus size={19} weight="bold" />
						{/if}
					</button>
					<button
						type="button"
						bind:this={lightboxCloseBtn}
						onclick={() => (lightboxOpen = false)}
						aria-label="Close image viewer"
						class="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					>
						<X size={19} weight="bold" />
					</button>
				</div>
			</div>
			<div class="mt-3 flex w-full items-center gap-2 sm:gap-4">
				<button
					type="button"
					onclick={() => stepImage(-1)}
					aria-label="Previous image"
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
				>
					<CaretLeft size={20} weight="bold" />
				</button>
				<div
					role="button"
					tabindex="0"
					aria-label={zoomed
						? 'Zoomed product image — press Enter to zoom out'
						: 'Product image — press Enter to zoom in'}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							toggleZoom();
						}
					}}
					class="min-w-0 flex-1 overflow-hidden rounded-3xl {zoomed
						? 'cursor-grab touch-none active:cursor-grabbing'
						: 'cursor-zoom-in'}"
					onpointerdown={onZoomPointerDown}
					onpointermove={onZoomPointerMove}
					onpointerup={onZoomPointerUp}
					onpointercancel={onZoomPointerUp}
					onclick={onZoomClick}
				>
					<img
						bind:this={zoomImg}
						src={responsiveImage(galleryImages[activeImage]).src}
						srcset={responsiveImage(galleryImages[activeImage]).srcset}
						sizes="(max-width: 1023px) 100vw, 896px"
						alt="{product.name} — view {activeImage + 1} of {galleryImages.length}"
						width="1600"
						height="1600"
						draggable="false"
						class="zoom-img max-h-[75dvh] w-full object-contain select-none"
						style="transform: translate({panX}px, {panY}px) scale({zoomed ? ZOOM_SCALE : 1})"
					/>
				</div>
				<button
					type="button"
					onclick={() => stepImage(1)}
					aria-label="Next image"
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
				>
					<CaretRight size={20} weight="bold" />
				</button>
			</div>
			<div class="mt-4 flex gap-2">
				{#each galleryImages as src, i}
					<button
						type="button"
						onclick={() => goToImage(i)}
						aria-label="Show image {i + 1}"
						aria-current={activeImage === i}
						class="h-16 w-16 overflow-hidden rounded-xl border-2 {activeImage === i ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}"
					>
						<img src={responsiveImage(src).src} srcset={responsiveImage(src).srcset} sizes="64px" alt="" width="128" height="128" class="h-full w-full object-cover" />
					</button>
				{/each}
			</div>
			<p class="mt-3 text-xs text-white/60">
				{zoomed ? 'Drag to pan · click the photo or the zoom button to zoom out' : 'Click the photo to zoom in'} · Esc to close
			</p>
		</div>
	</div>
{/if}

<style>
	/* Lightbox zoom (F-15b): transform-only transition, off under reduced motion. */
	.zoom-img {
		transition: transform 200ms ease;
	}
	@media (prefers-reduced-motion: reduce) {
		.zoom-img {
			transition: none;
		}
	}
</style>
