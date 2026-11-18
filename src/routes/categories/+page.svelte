<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList, collectionPage } from '#lib/jsonld';
	import { ArrowRight } from 'phosphor-svelte';
	import Reveal from '#lib/components/Reveal.svelte';
	import { categories, products } from '#lib/data/products';
	import { responsiveImage } from '#lib/images';

	const brands = [...new Set(products.map((p) => p.brand))].sort();
</script>

<svelte:head>
	<Seo
		title="Categories — Shoemate"
		description="Browse sneaker categories at Shoemate: premium sneakers, top picks, bestsellers and fresh drops."
		ogImage="/images/og-cat-premium.jpg"
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Categories' }])} />
<!-- ItemList = the four category cards rendered on this page; each links
	     to its filtered Shop view. -->
<JsonLd
		data={collectionPage(
			'Categories',
			'/categories/',
			categories.map((c) => ({ name: c.name, href: `/shop?collection=${c.slug}` }))
		)}
	/>

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Categories</p>
		<h1 class="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Find your lane</h1>
		<p class="mt-2 max-w-xl text-[15px] text-ink-soft">
			Four curated collections, one goal: the right pair for every run, walk and fit check.
		</p>
	</Reveal>

	<div class="mt-8 grid gap-4 sm:grid-cols-2">
		{#each categories as cat, i}
			<Reveal delay={i * 70}>
				<a
					href="/shop?collection={cat.slug}"
					class="group relative block min-h-[280px] overflow-hidden rounded-3xl shadow-card transition-shadow hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:min-h-[320px]"
					style="background: {cat.bg}"
				>
					<img
						src={responsiveImage(cat.image).src}
						srcset={responsiveImage(cat.image).srcset}
						sizes="(max-width: 639px) 100vw, 640px"
						alt={cat.name}
						loading="lazy"
						width="1600"
						height="1600"
						class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
					/>
					<span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 pt-24 text-white">
						<span class="text-2xl font-extrabold">{cat.name}</span>
						<span class="mt-1 block text-sm text-white/85">{cat.tagline} · {cat.count} styles</span>
						<span class="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors group-hover:bg-brand-500 group-hover:text-white">
							{cat.cta} <ArrowRight size={15} weight="bold" />
						</span>
					</span>
				</a>
			</Reveal>
		{/each}
	</div>

	<Reveal>
		<div class="mt-12 rounded-3xl bg-white p-6 shadow-card sm:p-8">
			<h2 class="text-lg font-extrabold tracking-tight uppercase">Shop by brand</h2>
			<div class="mt-4 flex flex-wrap gap-2">
				{#each brands as brand}
					<a
						href="/shop?brand={brand}"
						class="inline-flex min-h-11 items-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
					>
						{brand}
					</a>
				{/each}
			</div>
		</div>
	</Reveal>
</section>
