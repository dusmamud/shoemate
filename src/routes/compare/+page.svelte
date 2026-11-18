<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import { ArrowRight, Scales, Trash, X } from 'phosphor-svelte';
	import { compare, COMPARE_MAX } from '#lib/compare.svelte';
	import { getProduct } from '#lib/data/products';
	import { getSpecs } from '#lib/data/specs';
	import { responsiveImage } from '#lib/images';
	import { toast } from '#lib/toast.svelte';

	let items = $derived(compare.slugs.map((slug) => getProduct(slug)).filter((p) => p !== undefined));

	function remove(slug: string) {
		const p = getProduct(slug);
		compare.remove(slug);
		if (p) toast.info(`${p.name} removed from compare`);
	}

	function discount(p: { price: number; oldPrice?: number }) {
		return p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
	}
</script>

<svelte:head>
	<Seo
		title="Compare Sneakers — Shoemate"
		description="Compare up to 3 sneakers side by side: price, rating, weight, drop, materials and cushioning."
		noindex
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Compare' }])} />

<section class="pt-8">
	<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Compare</p>
	<h1 class="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Side by side</h1>
	<p class="mt-2 max-w-xl text-[15px] text-ink-soft">
		Compare up to {COMPARE_MAX} sneakers on price, rating and specs. Specs are indicative per-model figures.
	</p>

	{#if items.length === 0}
		<div class="mt-8 rounded-3xl bg-white p-6 text-center shadow-card sm:p-10">
			<span class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mist text-ink-soft">
				<Scales size={30} />
			</span>
			<p class="mt-4 text-lg font-bold">Nothing to compare yet</p>
			<p class="mt-1 text-sm text-ink-soft">Tap the compare icon on any product card to add it here (up to {COMPARE_MAX}).</p>
			<a href="/shop" class="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-white hover:bg-brand-500">
				Browse sneakers <ArrowRight size={17} weight="bold" />
			</a>
		</div>
	{:else}
		<div class="mt-8 overflow-x-auto rounded-3xl bg-white shadow-card">
			<table class="w-full min-w-[560px] border-collapse text-left">
				<thead>
					<tr class="align-top">
						<th scope="col" class="w-36 p-4 text-xs font-bold tracking-widest text-ink-soft uppercase sm:p-5">Sneaker</th>
						{#each items as p (p.slug)}
							<th scope="col" class="min-w-44 p-4 sm:p-5">
								<a href="/product/{p.slug}" class="group block">
									<img src={responsiveImage(p.image).src} srcset={responsiveImage(p.image).srcset} sizes="(max-width: 639px) 176px, 400px" alt={p.name} loading="lazy" width="400" height="400" class="aspect-square w-full rounded-2xl bg-mist object-cover" />
									<span class="mt-2 block text-[15px] leading-snug font-bold group-hover:text-brand-600">{p.name}</span>
									<span class="text-xs font-medium text-ink-soft">{p.brand} · {p.category}</span>
								</a>
								<button
									type="button"
									onclick={() => remove(p.slug)}
									class="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-mist px-3.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-brand-500"
									aria-label="Remove {p.name} from compare"
								>
									<X size={14} weight="bold" /> Remove
								</button>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody class="text-sm">
					<tr class="border-t border-line">
						<th scope="row" class="p-4 text-xs font-bold tracking-widest text-ink-soft uppercase sm:p-5">Price</th>
						{#each items as p (p.slug)}
							<td class="p-4 sm:p-5">
								<span class="text-base font-extrabold">${p.price}</span>
								{#if p.oldPrice}
									<span class="ml-1.5 text-ink-soft line-through">${p.oldPrice}</span>
									<span class="ml-1.5 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-600">−{discount(p)}%</span>
								{/if}
							</td>
						{/each}
					</tr>
					<tr class="border-t border-line">
						<th scope="row" class="p-4 text-xs font-bold tracking-widest text-ink-soft uppercase sm:p-5">Rating</th>
						{#each items as p (p.slug)}
							<td class="p-4 font-semibold sm:p-5">{p.rating.toFixed(1)} ★ <span class="font-normal text-ink-soft">({p.reviews.toLocaleString()} reviews)</span></td>
						{/each}
					</tr>
					<tr class="border-t border-line">
						<th scope="row" class="p-4 text-xs font-bold tracking-widest text-ink-soft uppercase sm:p-5">Weight <span class="normal-case">(UK 9, per shoe)</span></th>
						{#each items as p (p.slug)}
							<td class="p-4 font-semibold sm:p-5">{getSpecs(p.slug)?.weight ?? '—'}</td>
						{/each}
					</tr>
					<tr class="border-t border-line">
						<th scope="row" class="p-4 text-xs font-bold tracking-widest text-ink-soft uppercase sm:p-5">Heel-to-toe drop</th>
						{#each items as p (p.slug)}
							<td class="p-4 font-semibold sm:p-5">{getSpecs(p.slug)?.drop ?? '—'}</td>
						{/each}
					</tr>
					<tr class="border-t border-line">
						<th scope="row" class="p-4 text-xs font-bold tracking-widest text-ink-soft uppercase sm:p-5">Materials</th>
						{#each items as p (p.slug)}
							<td class="p-4 sm:p-5">{getSpecs(p.slug)?.materials ?? '—'}</td>
						{/each}
					</tr>
					<tr class="border-t border-line">
						<th scope="row" class="p-4 text-xs font-bold tracking-widest text-ink-soft uppercase sm:p-5">Cushioning</th>
						{#each items as p (p.slug)}
							<td class="p-4 sm:p-5">{getSpecs(p.slug)?.cushioning ?? '—'}</td>
						{/each}
					</tr>
					<tr class="border-t border-line">
						<th scope="row" class="p-4 text-xs font-bold tracking-widest text-ink-soft uppercase sm:p-5">Sizes</th>
						{#each items as p (p.slug)}
							<td class="p-4 sm:p-5">{p.sizes.join(', ')}</td>
						{/each}
					</tr>
				</tbody>
			</table>
		</div>

		<div class="mt-5 flex flex-wrap items-center gap-3">
			<button
				type="button"
				onclick={() => {
					compare.clear();
					toast.info('Compare list cleared');
				}}
				class="inline-flex h-11 items-center gap-2 rounded-full bg-mist px-5 text-sm font-semibold transition-colors hover:bg-peach focus-visible:ring-2 focus-visible:ring-brand-500"
			>
				<Trash size={16} /> Clear compare
			</button>
			<a href="/shop" class="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-brand-500">
				Continue shopping <ArrowRight size={16} weight="bold" />
			</a>
		</div>
	{/if}
</section>
