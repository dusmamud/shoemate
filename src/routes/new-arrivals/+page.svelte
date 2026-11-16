<script lang="ts">
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Reveal from '#lib/components/Reveal.svelte';
	import { products } from '#lib/data/products';

	const arrivals = products.slice(0, 8);
	const fresh = products.filter((p) => p.badge === 'New' || p.badge === 'Limited');
</script>

<svelte:head>
	<title>New Arrivals — Shoemate</title>
	<meta name="description" content="The freshest sneaker drops at Shoemate. New arrivals, updated weekly." />
</svelte:head>

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Just landed</p>
		<h1 class="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">New Arrivals</h1>
		<p class="mt-2 max-w-xl text-[15px] text-ink-soft">
			Fresh colourways and brand-new silhouettes, updated weekly. When a drop sells out, it is gone.
		</p>
	</Reveal>

	{#if fresh.length}
		<h2 class="mt-10 text-lg font-extrabold tracking-tight uppercase">Fresh this week</h2>
		<div class="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
			{#each fresh as product, i}
				<Reveal delay={i * 60}>
					<ProductCard {product} />
				</Reveal>
			{/each}
		</div>
	{/if}

	<h2 class="mt-12 text-lg font-extrabold tracking-tight uppercase">All new arrivals</h2>
	<div class="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
		{#each arrivals as product, i}
			<Reveal delay={Math.min(i, 5) * 50}>
				<ProductCard {product} />
			</Reveal>
		{/each}
	</div>
</section>
