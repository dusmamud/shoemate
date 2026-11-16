<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { ArrowRight, Minus, Plus, ShoppingBag, Trash, Truck, X } from 'phosphor-svelte';
	import { cart, ui } from '#lib/store.svelte';
	import { getProduct } from '#lib/data/products';

	const FREE_SHIPPING_AT = 150;

	let progress = $derived(Math.min(100, (cart.subtotal / FREE_SHIPPING_AT) * 100));

	$effect(() => {
		document.body.style.overflow = ui.cartOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') ui.cartOpen = false;
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if ui.cartOpen}
	<div
		class="fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px]"
		transition:fade={{ duration: 200 }}
		onclick={() => (ui.cartOpen = false)}
		role="presentation"
	></div>
	<div
		class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
		transition:fly={{ x: 420, duration: 320, opacity: 1 }}
		role="dialog"
		aria-labelledby="cart-drawer-title"
		aria-modal="true"
	>
		<div class="flex items-center justify-between border-b border-line px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
			<h2 id="cart-drawer-title" class="flex items-center gap-2 text-lg font-bold">
				<ShoppingBag size={22} weight="bold" /> Your Cart
				<span class="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-600">{cart.count} items</span>
			</h2>
			<button
				type="button"
				onclick={() => (ui.cartOpen = false)}
				class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
				aria-label="Close cart"
			>
				<X size={20} />
			</button>
		</div>

		{#if cart.lines.length}
			<div class="border-b border-line px-5 py-3">
				<p class="flex items-center gap-2 text-[13px] font-medium">
					<Truck size={17} class="text-brand-500" />
					{#if cart.subtotal >= FREE_SHIPPING_AT}
						<span class="text-emerald-700">You have unlocked FREE shipping!</span>
					{:else}
						Add <strong>${FREE_SHIPPING_AT - cart.subtotal}</strong> more for free shipping
					{/if}
				</p>
				<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-mist" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Progress towards free shipping">
					<div class="h-full rounded-full bg-brand-500 transition-all duration-500" style="width: {progress}%"></div>
				</div>
			</div>

			<ul class="nice-scroll flex-1 divide-y divide-line overflow-y-auto px-5">
				{#each cart.lines as line (line.slug + line.size)}
					{@const p = getProduct(line.slug)}
					{#if p}
						<li class="flex gap-3 py-4">
							<a href="/product/{p.slug}" onclick={() => (ui.cartOpen = false)} class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
								<img src={p.image} alt={p.name} class="h-full w-full object-cover" width="160" height="160" />
							</a>
							<div class="flex min-w-0 flex-1 flex-col">
								<div class="flex items-start justify-between gap-2">
									<div>
										<a href="/product/{p.slug}" onclick={() => (ui.cartOpen = false)} class="rounded text-sm leading-snug font-semibold hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
											{p.name}
										</a>
										<p class="mt-0.5 text-xs text-ink-soft">{p.brand} · Size {line.size}</p>
									</div>
									<button
										type="button"
										onclick={() => cart.remove(line.slug, line.size)}
										class="flex h-11 w-11 -mt-2 -mr-2 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-mist hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
										aria-label="Remove {p.name} from cart"
									>
										<Trash size={17} />
									</button>
								</div>
								<div class="mt-auto flex items-center justify-between pt-2">
									<div class="flex items-center rounded-full border border-line">
										<button type="button" onclick={() => cart.setQty(line.slug, line.size, line.qty - 1)} class="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-brand-500" aria-label="Decrease quantity">
											<Minus size={15} weight="bold" />
										</button>
										<span class="w-7 text-center text-sm font-semibold">{line.qty}</span>
										<button type="button" onclick={() => cart.setQty(line.slug, line.size, line.qty + 1)} class="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-brand-500" aria-label="Increase quantity">
											<Plus size={15} weight="bold" />
										</button>
									</div>
									<span class="text-sm font-bold">${p.price * line.qty}</span>
								</div>
							</div>
						</li>
					{/if}
				{/each}
			</ul>

			<div class="border-t border-line px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
				<div class="flex justify-between text-sm">
					<span class="text-ink-soft">Subtotal</span>
					<span class="font-bold">${cart.subtotal}</span>
				</div>
				<div class="mt-1 flex justify-between text-sm">
					<span class="text-ink-soft">Shipping</span>
					<span class="font-semibold">{cart.subtotal >= FREE_SHIPPING_AT ? 'Free' : 'Calculated at checkout'}</span>
				</div>
				<a
					href="/checkout"
					onclick={() => (ui.cartOpen = false)}
					class="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
				>
					Checkout · ${cart.subtotal} <ArrowRight size={17} weight="bold" />
				</a>
				<button
					type="button"
					onclick={() => (ui.cartOpen = false)}
					class="mt-2 h-11 w-full rounded-full text-sm font-medium text-ink-soft transition-colors hover:bg-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
				>
					Continue shopping
				</button>
			</div>
		{:else}
			<div class="flex flex-1 flex-col items-center justify-center gap-3 px-8 pb-[env(safe-area-inset-bottom)] text-center">
				<span class="flex h-20 w-20 items-center justify-center rounded-full bg-peach text-brand-500">
					<ShoppingBag size={34} weight="bold" />
				</span>
				<h3 class="text-lg font-bold">Your cart is empty</h3>
				<p class="text-sm text-ink-soft">Fresh drops are waiting. Go find your next pair.</p>
				<a
					href="/shop"
					onclick={() => (ui.cartOpen = false)}
					class="mt-2 flex h-11 items-center gap-2 rounded-full bg-brand-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
				>
					Shop sneakers <ArrowRight size={17} weight="bold" />
				</a>
			</div>
		{/if}
	</div>
{/if}
