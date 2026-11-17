<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { ArrowUpRight, Fire, MagnifyingGlass, X } from 'phosphor-svelte';
	import { searchProducts } from '#lib/api';
	import { ui } from '#lib/store.svelte';
	import { focusTrap } from '#lib/focus-trap';
	import Skeleton from '#lib/components/Skeleton.svelte';

	let q = $state('');
	let input: HTMLInputElement | undefined = $state();
	let searching = $state(false);
	let lastTrigger: HTMLElement | null = null;
	let searchTimer: ReturnType<typeof setTimeout> | undefined;

	let results = $derived(searchProducts(q));

	const popular = ['Air Max', 'Jordan', 'Running', 'Vans', 'New Balance', 'White sneakers'];

	$effect(() => {
		if (ui.searchOpen) {
			lastTrigger = document.activeElement as HTMLElement | null;
			document.body.style.overflow = 'hidden';
			setTimeout(() => input?.focus(), 60);
		} else {
			document.body.style.overflow = '';
			q = '';
			searching = false;
			// Return focus to whatever opened the overlay (M-23).
			lastTrigger?.focus?.();
			lastTrigger = null;
		}
		return () => {
			document.body.style.overflow = '';
		};
	});

	// Explicit submit (M-18): brief skeleton beat (N-09) while results settle.
	function submitSearch(e: SubmitEvent) {
		e.preventDefault();
		if (!q.trim()) return;
		searching = true;
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => (searching = false), 300);
	}

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
		class="fixed inset-x-0 top-0 z-50 max-h-dvh overflow-y-auto bg-white shadow-2xl"
		transition:fly={{ y: -24, duration: 260, opacity: 1 }}
		role="dialog"
		aria-label="Search products"
		aria-modal="true"
		use:focusTrap
	>
		<div class="mx-auto max-w-3xl px-4 py-6 sm:py-8">
			<form onsubmit={submitSearch} class="flex items-center gap-3 border-b-2 border-ink pb-3">
				<MagnifyingGlass size={24} class="shrink-0 text-ink-soft" />
				<label class="sr-only" for="site-search">Search products</label>
				<input
					id="site-search"
					bind:this={input}
					bind:value={q}
					type="search"
					enterkeyhint="search"
					placeholder="Search sneakers…"
					class="min-w-0 flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-ink-soft/60"
				/>
				<button
					type="submit"
					class="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
				>
					<MagnifyingGlass size={16} weight="bold" /> Search
				</button>
				<button
					type="button"
					onclick={() => (ui.searchOpen = false)}
					class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-mist focus-visible:ring-2 focus-visible:ring-brand-500"
					aria-label="Close search"
				>
					<X size={20} />
				</button>
			</form>

			{#if q.trim()}
				{#if searching}
					<div class="mt-4 space-y-3" aria-hidden="true">
						{#each Array(3) as _, i (i)}
							<div class="flex items-center gap-4 px-2 py-3">
								<Skeleton class="h-14 w-14 shrink-0 !rounded-xl" label="Loading search result" />
								<div class="min-w-0 flex-1">
									<Skeleton class="h-4 w-2/3" label="Loading search result" />
									<Skeleton class="mt-2 h-3 w-1/3" label="Loading search result" />
								</div>
							</div>
						{/each}
					</div>
				{:else if results.length}
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
								class="min-h-11 rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-600 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
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
