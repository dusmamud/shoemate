<script lang="ts">
	import { ArrowRight, Heart, Plus } from 'phosphor-svelte';
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

<!-- Reference-minimal at rest (grey card, name, price, arrow); badges, wishlist
	and quick-add appear on hover/focus only, so the resting grid matches the design. -->
<article
	class="group relative flex flex-col overflow-hidden rounded-3xl bg-mist transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card"
>
	<a href="/product/{product.slug}" class="relative block overflow-hidden bg-mist" aria-label={product.name}>
		<img
			src={product.image}
			alt={product.name}
			loading="lazy"
			width="800"
			height="800"
			class="aspect-square w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.06]"
		/>
		{#if product.badge}
			<span
				class="absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide text-white uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100
				{product.badge === 'Deal' ? 'bg-ink' : product.badge === 'Limited' ? 'bg-ink' : 'bg-brand-500'}"
			>
				{product.badge}
			</span>
		{/if}
		{#if product.oldPrice}
			<span class="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
				-{Math.round((1 - product.price / product.oldPrice) * 100)}%
			</span>
		{/if}
	</a>

	<button
		type="button"
		onclick={() => wishlist.toggle(product.slug)}
		aria-label={wishlist.has(product.slug) ? 'Remove from wishlist' : 'Add to wishlist'}
		aria-pressed={wishlist.has(product.slug)}
		class="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-all hover:scale-110 group-hover:opacity-100 group-focus-within:opacity-100 {product.oldPrice
			? 'translate-y-9'
			: ''}"
	>
		<Heart
			size={18}
			weight={wishlist.has(product.slug) ? 'fill' : 'regular'}
			class={wishlist.has(product.slug) ? 'text-brand-500' : 'text-ink'}
		/>
	</button>

	<div class="flex flex-1 flex-col p-4 sm:p-5">
		<div class="flex items-start justify-between gap-2">
			<a href="/product/{product.slug}" class="text-[15px] leading-snug font-semibold hover:text-brand-600 sm:text-base">
				{product.name}
			</a>
			<a
				href="/product/{product.slug}"
				aria-label="View {product.name}"
				class="mt-0.5 shrink-0 text-ink-soft transition-colors hover:text-brand-600"
			>
				<ArrowRight size={18} weight="bold" />
			</a>
		</div>
		<div class="mt-1 flex items-baseline gap-2">
			<span class="text-lg font-bold">${product.price}</span>
			{#if product.oldPrice}
				<span class="text-sm text-ink-soft line-through">${product.oldPrice}</span>
			{/if}
		</div>
		<div class="grid grid-rows-[0fr] transition-all duration-300 group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
			<div class="overflow-hidden">
				<button
					type="button"
					onclick={quickAdd}
					class="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-white transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 {added
						? 'bg-emerald-600'
						: 'bg-ink hover:bg-brand-500'}"
					aria-label="Quick add {product.name} to cart"
				>
					{#if added}
						Added ✓
					{:else}
						<Plus size={16} weight="bold" />
						Add to cart
					{/if}
				</button>
			</div>
		</div>
	</div>
</article>
