<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { ArrowUpRight, Fire, MagnifyingGlass, X } from 'phosphor-svelte';
	import { searchProducts } from '#lib/api';
	import { ui } from '#lib/store.svelte';

	let q = $state('');
	let input: HTMLInputElement | undefined = $state();

	let results = $derived(searchProducts(q));

	const popular = ['Air Max', 'Jordan', 'Running', 'Vans', 'New Balance', 'White sneakers'];

	$effect(() => {
		if (ui.searchOpen) {
			document.body.style.overflow = 'hidden';
			setTimeout(() => input?.focus(), 60);
		} else {
			document.body.style.overflow = '';
			q = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') ui.searchOpen = false;
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if ui.searchOpen}
	<div
		class="fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px]"
		transition:fade={{ duration: 180 }}
		onclick={() => (ui.searchOpen = false)}
		role="presentation"
	></div>
	<div
		class="fixed inset-x-0 top-0 z-50 bg-white shadow-2xl"
		transition:fly={{ y: -24, duration: 260, opacity: 1 }}
		role="dialog"
		aria-label="Search products"
		aria-modal="true"
	>
		<div class="mx-auto max-w-3xl px-4 py-6 sm:py-8">
			<div class="flex items-center gap-3 border-b-2 border-ink pb-3">
				<MagnifyingGlass size={24} class="shrink-0 text-ink-soft" />
				<label class="sr-only" for="site-search">Search products</label>
				<input
					id="site-search"
					bind:this={input}
					bind:value={q}
					type="search"
					placeholder="Search sneakers, brands, categories…"
					class="min-w-0 flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-ink-soft/60"
				/>
				<button
					type="button"
					onclick={() => (ui.searchOpen = false)}
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-mist"
					aria-label="Close search"
				>
					<X size={20} />
				</button>
			</div>

			{#if q.trim()}
				{#if results.length}
					<ul class="nice-scroll mt-4 max-h-[55dvh] divide-y divide-line overflow-y-auto">
						{#each results as p (p.slug)}
							<li>
								<a
									href="/product/{p.slug}"
									onclick={() => (ui.searchOpen = false)}
									class="flex items-center gap-4 rounded-2xl px-2 py-3 transition-colors hover:bg-mist"
								>
									<img src={p.image} alt="" class="h-14 w-14 shrink-0 rounded-xl bg-mist object-cover" width="112" height="112" />
									<span class="min-w-0 flex-1">
										<span class="block truncate text-[15px] font-semibold">{p.name}</span>
										<span class="text-xs text-ink-soft">{p.brand} · {p.category}</span>
									</span>
									<span class="text-sm font-bold">${p.price}</span>
									<ArrowUpRight size={17} class="text-ink-soft" />
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-6 text-center text-sm text-ink-soft">
						No matches for “{q}”. Try a brand or a style like “running”.
					</p>
				{/if}
			{:else}
				<div class="mt-5">
					<p class="flex items-center gap-1.5 text-xs font-bold tracking-widest text-ink-soft uppercase">
						<Fire size={15} weight="fill" class="text-brand-500" /> Popular right now
					</p>
					<div class="mt-3 flex flex-wrap gap-2">
						{#each popular as term}
							<button
								type="button"
								onclick={() => (q = term)}
								class="rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600"
							>
								{term}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
