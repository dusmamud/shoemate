<script lang="ts">
	import { ArrowUpRight, Heart, Plus, Star } from 'phosphor-svelte';
	import { cart, wishlist } from '#lib/store.svelte';
	import type { Product } from '#lib/data/products';

	let { product }: { product: Product } = $props();

	let added = $state(false);

	function quickAdd() {
		cart.add(product.slug, 'UK 9', 1);
		added = true;
		setTimeout(() => (added = false), 1400);
	}
</script>

<article
	class="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
>
	<a href="/product/{product.slug}" class="relative block overflow-hidden bg-mist" aria-label={product.name}>
		<img
			src={product.image}
			alt={product.name}
			loading="lazy"
			width="800"
			height="800"
			class="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
		/>
		{#if product.badge}
			<span
				class="absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-white uppercase
				{product.badge === 'Deal' ? 'bg-ink' : product.badge === 'Limited' ? 'bg-ink' : 'bg-brand-500'}"
			>
				{product.badge}
			</span>
		{/if}
		{#if product.oldPrice}
			<span class="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-600">
				-{Math.round((1 - product.price / product.oldPrice) * 100)}%
			</span>
		{/if}
	</a>

	<button
		type="button"
		onclick={() => wishlist.toggle(product.slug)}
		aria-label={wishlist.has(product.slug) ? 'Remove from wishlist' : 'Add to wishlist'}
		aria-pressed={wishlist.has(product.slug)}
		class="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110 {product.oldPrice
			? 'translate-y-9'
			: ''}"
	>
		<Heart
			size={18}
			weight={wishlist.has(product.slug) ? 'fill' : 'regular'}
			class={wishlist.has(product.slug) ? 'text-brand-500' : 'text-ink'}
		/>
	</button>

	<div class="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
		<div class="flex items-center justify-between gap-2">
			<span class="text-[11px] font-semibold tracking-widest text-ink-soft uppercase">{product.brand}</span>
			<span class="flex items-center gap-1 text-xs font-semibold">
				<Star size={14} weight="fill" class="text-amber-400" />
				{product.rating.toFixed(1)}
				<span class="font-normal text-ink-soft">({product.reviews.toLocaleString()})</span>
			</span>
		</div>
		<a href="/product/{product.slug}" class="text-[15px] leading-snug font-semibold hover:text-brand-600 sm:text-base">
			{product.name}
		</a>
		<p class="line-clamp-1 text-[13px] text-ink-soft">{product.blurb}</p>
		<div class="mt-auto flex items-end justify-between pt-2">
			<div class="flex items-baseline gap-2">
				<span class="text-lg font-bold">${product.price}</span>
				{#if product.oldPrice}
					<span class="text-sm text-ink-soft line-through">${product.oldPrice}</span>
				{/if}
			</div>
			<button
				type="button"
				onclick={quickAdd}
				class="flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-white transition-colors {added
					? 'bg-emerald-600'
					: 'bg-ink hover:bg-brand-500'}"
				aria-label="Quick add {product.name} to cart"
			>
				{#if added}
					Added ✓
				{:else}
					<Plus size={16} weight="bold" />
					<span class="hidden sm:inline">Add</span>
				{/if}
			</button>
		</div>
		<a
			href="/product/{product.slug}"
			class="mt-1 inline-flex items-center gap-1 text-[13px] font-semibold text-ink-soft transition-colors hover:text-brand-600"
		>
			View details <ArrowUpRight size={15} weight="bold" />
		</a>
	</div>
</article>
