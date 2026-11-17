<script lang="ts">
	import { ArrowRight, ArrowsLeftRight, Check, Heart, Plus } from 'phosphor-svelte';
	import { cart, wishlist } from '#lib/store.svelte';
	import { compare, COMPARE_MAX } from '#lib/compare.svelte';
	import { toast } from '#lib/toast.svelte';
	import type { Product } from '#lib/data/products';

	let { product, morph = false }: { product: Product; morph?: boolean } = $props();

	let added = $state(false);

	// Fly-to-cart micro-animation (N-08): a small dot travels from the
	// clicked Add button to the header cart button in ~550ms. Reduced-motion
	// safe (skipped), and purely decorative — the "Added" state + drawer
	// remain the real confirmation. No cart-badge bump (needs header coupling).
	function flyToCart(from: HTMLElement) {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const target = document.querySelector('button[aria-label^="Open cart"]');
		if (!target) return;
		const a = from.getBoundingClientRect();
		const b = target.getBoundingClientRect();
		const dx = b.left + b.width / 2 - (a.left + a.width / 2);
		const dy = b.top + b.height / 2 - (a.top + a.height / 2);
		const dot = document.createElement('span');
		dot.className = 'fly-dot';
		dot.style.left = `${a.left + a.width / 2}px`;
		dot.style.top = `${a.top + a.height / 2}px`;
		document.body.appendChild(dot);
		const anim = dot.animate(
			[
				{ transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
				{ transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.35)`, opacity: '0.5' }
			],
			{ duration: 550, easing: 'cubic-bezier(0.2, 0, 0, 1)' }
		);
		anim.onfinish = () => dot.remove();
	}

	// First in-stock size from real per-size stock (M-03) — never a
	// hardcoded size, and never a silent add when nothing is in stock.
	const firstInStockSize = $derived(product.sizeStock.find((s) => s.stock > 0)?.size ?? null);

	function quickAdd(e: MouseEvent) {
		if (!firstInStockSize) {
			toast.error(`${product.name} is out of stock in every size`);
			return;
		}
		cart.add(product.slug, firstInStockSize, 1);
		added = true;
		flyToCart(e.currentTarget as HTMLElement);
		setTimeout(() => (added = false), 1400);
	}

	function toggleCompare() {
		const result = compare.toggle(product.slug);
		if (result === 'added') toast.success(`${product.name} added to compare`);
		else if (result === 'removed') toast.info(`${product.name} removed from compare`);
		else toast.error(`Compare holds up to ${COMPARE_MAX} shoes — remove one first`);
	}
</script>

<!-- Reference-minimal at rest on desktop (grey card, name, price, arrow);
     badges, wishlist and quick-add appear on hover/focus there. On touch /
     small screens there is no hover, so everything is always visible —
     otherwise quick-add and wishlist are unreachable on mobile. -->
<article
	class="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-mist transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card"
>
	<a href="/product/{product.slug}" class="relative block overflow-hidden bg-mist" aria-label={product.name}>
		<img
			src={product.image}
			alt={product.name}
			loading="lazy"
			width="800"
			height="800"
			style={morph ? `view-transition-name: product-${product.slug}` : undefined}
			class="aspect-square w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.06]"
		/>
		{#if product.badge}
			<span
				class="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100
				{product.badge === 'Deal' ? 'bg-ink' : product.badge === 'Limited' ? 'bg-ink' : 'bg-brand-500'}"
			>
				{product.badge}
			</span>
		{/if}
		{#if product.oldPrice}
			<span class="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-brand-600 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
				-{Math.round((1 - product.price / product.oldPrice) * 100)}%
			</span>
		{/if}
	</a>

	<button
		type="button"
		onclick={() => wishlist.toggle(product.slug)}
		aria-label={wishlist.has(product.slug) ? 'Remove from wishlist' : 'Add to wishlist'}
		aria-pressed={wishlist.has(product.slug)}
		class="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-110 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 {product.oldPrice
			? 'top-14'
			: 'top-3'}"
	>
		<Heart
			size={20}
			weight={wishlist.has(product.slug) ? 'fill' : 'regular'}
			class={wishlist.has(product.slug) ? 'text-brand-500' : 'text-ink'}
		/>
	</button>

	<div class="flex flex-1 flex-col p-4 sm:p-5">
		<div class="flex items-start justify-between gap-2">
			<a href="/product/{product.slug}" class="flex min-h-11 items-center text-[15px] leading-snug font-semibold hover:text-brand-600 sm:text-base">
				{product.name}
			</a>
			<a
				href="/product/{product.slug}"
				aria-label="View {product.name}"
				class="-my-3 -mr-3 flex h-11 w-11 shrink-0 items-center justify-center text-ink-soft transition-colors hover:text-brand-600"
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
		<div class="grid grid-rows-[1fr] transition-all duration-300 lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr]">
			<div class="overflow-hidden">
				<div class="mt-3 flex gap-2">
					<button
						type="button"
						onclick={quickAdd}
						disabled={!firstInStockSize}
						class="flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 {added
							? 'bg-emerald-600'
							: 'bg-ink hover:bg-brand-500'}"
						aria-label={firstInStockSize ? `Quick add ${product.name} to cart` : `${product.name} is out of stock`}
					>
						{#if !firstInStockSize}
							Sold out
						{:else if added}
							<Check size={16} weight="bold" /> Added
						{:else}
							<Plus size={16} weight="bold" />
							Add to cart
						{/if}
					</button>
					<button
						type="button"
						onclick={toggleCompare}
						aria-pressed={compare.has(product.slug)}
						aria-label={compare.has(product.slug) ? `Remove ${product.name} from compare` : `Add ${product.name} to compare`}
						title={compare.has(product.slug) ? 'Remove from compare' : 'Compare'}
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 {compare.has(product.slug)
							? 'border-brand-500 bg-brand-50 text-brand-600'
							: 'border-line bg-white text-ink-soft hover:border-brand-500 hover:text-brand-600'}"
					>
						<ArrowsLeftRight size={18} />
					</button>
				</div>
			</div>
		</div>
	</div>
</article>
