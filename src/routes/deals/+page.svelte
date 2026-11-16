<script lang="ts">
	import { Fire, Tag } from 'phosphor-svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Reveal from '#lib/components/Reveal.svelte';
	import { products } from '#lib/data/products';

	const deals = products.filter((p) => p.oldPrice).sort((a, b) => b.oldPrice! - b.price - (a.oldPrice! - a.price));
	const biggest = deals[0];

	let copied = $state(false);
	function copyCode() {
		navigator.clipboard?.writeText('SHOEMATE10').catch(() => {});
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<svelte:head>
	<title>Deals &amp; Offers — Shoemate</title>
	<meta name="description" content="Sneaker deals at Shoemate: up to 30% off bestsellers plus an extra 10% with code SHOEMATE10." />
</svelte:head>

<section class="pt-8">
	<Reveal>
		<div class="overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-white sm:px-10">
			<p class="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold tracking-widest uppercase">
				<Fire size={15} weight="fill" /> Deals
			</p>
			<h1 class="mt-4 max-w-xl text-3xl leading-tight font-extrabold text-balance sm:text-4xl">
				Up to 30% off — plus an extra 10% with code
			</h1>
			<button
				type="button"
				onclick={copyCode}
				class="mt-5 flex min-h-11 w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border-2 border-dashed border-white/40 px-4 py-2.5 font-mono text-base font-bold tracking-widest transition-colors hover:border-brand-400 hover:text-brand-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto sm:px-5 sm:text-lg"
				aria-label="Copy discount code SHOEMATE10"
			>
				<Tag size={19} class="shrink-0" />
				<span>SHOEMATE10</span>
				<span class="font-sans text-sm font-semibold tracking-normal">{copied ? '· Copied ✓' : '· Tap to copy'}</span>
			</button>
			{#if biggest}
				<p class="mt-4 text-sm text-white/70">
					Biggest saving right now: <a href="/product/{biggest.slug}" class="inline-flex min-h-11 items-center font-semibold text-white underline decoration-brand-400 underline-offset-2 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{biggest.name}</a>
					— save ${biggest.oldPrice! - biggest.price}.
				</p>
			{/if}
		</div>
	</Reveal>

	<h2 class="mt-10 text-xl font-extrabold tracking-tight uppercase">On sale now</h2>
	<div class="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
		{#each deals as product, i}
			<Reveal delay={Math.min(i, 5) * 50}>
				<ProductCard {product} />
			</Reveal>
		{/each}
	</div>

	<Reveal>
		<p class="mt-10 rounded-3xl bg-white p-5 text-center text-sm text-ink-soft shadow-card">
			Discounts apply at checkout. The SHOEMATE10 code stacks with sale prices and works on your first order.
		</p>
	</Reveal>
</section>
