<script lang="ts">
	import { error } from '@sveltejs/kit';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Reveal from '#lib/components/Reveal.svelte';
	import { brandBlurbs, brandProducts, brandSlug, brands } from '#lib/data/content';
	import type { PageProps } from './$types';

	let { params }: PageProps = $props();
	const brand = brands.find((b) => brandSlug(b) === params.slug);
	if (!brand) error(404, 'Brand not found');
	const items = brandProducts(brand);
</script>

<svelte:head>
	<title>{brand} Sneakers — Shoemate</title>
	<meta name="description" content="Shop {brand} sneakers at Shoemate. {brandBlurbs[brand] ?? ''}" />
</svelte:head>

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Brand</p>
		<h1 class="mt-1 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">{brand}</h1>
		<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
			{brandBlurbs[brand] ?? `Shop ${brand} at Shoemate.`}
		</p>
		<p class="mt-2 text-sm text-ink-soft">{items.length} {items.length === 1 ? 'style' : 'styles'} in stock</p>
	</Reveal>

	<div class="mt-8 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
		{#each items as product, i}
			<Reveal delay={i * 70}>
				<ProductCard {product} morph />
			</Reveal>
		{/each}
	</div>

	<Reveal>
		<div class="mt-10 rounded-3xl bg-mist p-6 shadow-card sm:p-7">
			<h2 class="text-lg font-extrabold">More brands</h2>
			<div class="mt-3 flex flex-wrap gap-2">
				{#each brands.filter((b) => b !== brand) as other}
					<a href="/brand/{brandSlug(other)}" class="inline-flex h-11 items-center rounded-full bg-white px-4 text-sm font-semibold shadow-card transition-colors hover:bg-brand-500 hover:text-white">
						{other}
					</a>
				{/each}
			</div>
		</div>
	</Reveal>
</section>
