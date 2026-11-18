<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import { ArrowRight, Check, Sparkle, Star } from 'phosphor-svelte';
	import { getRewards } from '#lib/store.svelte';

	let rewards = $derived(getRewards());

	const tiers = [
		{
			name: 'Bronze',
			at: 0,
			perks: ['1 point per $1 spent', 'Members-only drops', 'Birthday treat (demo)']
		},
		{
			name: 'Silver',
			at: 500,
			perks: ['Everything in Bronze', 'Free express shipping', 'Early access to sales']
		},
		{
			name: 'Gold',
			at: 1500,
			perks: ['Everything in Silver', 'Exclusive Gold drops', 'Priority support (demo)']
		}
	];

	let progress = $derived(
		rewards.next ? Math.min(100, Math.round((rewards.points / rewards.next.at) * 100)) : 100
	);
</script>

<svelte:head>
	<Seo
		title="Rewards — Shoemate"
		description="Shoemate Rewards — earn points on every order and climb from Bronze to Gold. Demo programme, stored locally in this browser."
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Rewards' }])} />

<section class="pt-8">
	<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Shoemate Rewards</h1>
	<p class="mt-1 max-w-xl text-[15px] text-ink-soft">
		Every dollar you spend earns a point. Climb the tiers, unlock the perks.
	</p>
	<p class="mt-2 inline-flex items-center gap-2 rounded-full bg-peach px-4 py-2 text-[13px] font-semibold text-brand-700">
		<Sparkle size={16} weight="bold" /> Demo programme — points live in this browser only.
	</p>

	<div class="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
		<div class="min-w-0 space-y-6">
			<div class="rounded-3xl bg-ink p-5 text-white shadow-card sm:p-6">
				<p class="flex items-center gap-2 text-sm font-semibold text-white/70">
					<Star size={18} weight="fill" class="text-brand-400" /> Your balance
				</p>
				<p class="mt-2 text-4xl font-extrabold">{rewards.points} <span class="text-xl">points</span></p>
				<p class="mt-1 text-sm text-white/70">{rewards.tier} tier</p>
				{#if rewards.next}
					<div class="mt-5">
						<div class="flex justify-between text-[13px] font-semibold text-white/70">
							<span>{rewards.next.at - rewards.points} points to {rewards.next.name}</span>
							<span>{progress}%</span>
						</div>
						<div class="mt-2 h-2.5 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to {rewards.next.name} tier">
							<div class="h-full rounded-full bg-brand-500 transition-[width] duration-500" style="width: {progress}%"></div>
						</div>
					</div>
				{:else}
					<p class="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-300">
						<Check size={18} weight="bold" /> Top tier reached — enjoy Gold.
					</p>
				{/if}
			</div>

			<div class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
				<h2 class="text-lg font-extrabold">How it works</h2>
				<ol class="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
					<li>Place an order at demo checkout — 1 point per $1 of the order total.</li>
					<li>Points add up in this browser and move you up the tiers automatically.</li>
					<li>When the Go backend lands, real accounts will carry points across devices.</li>
				</ol>
				<a href="/shop" class="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
					Earn points — shop now <ArrowRight size={17} weight="bold" />
				</a>
			</div>
		</div>

		<aside class="min-w-0 space-y-4">
			{#each tiers as tier (tier.name)}
				{@const isCurrent = rewards.tier === tier.name}
				<div class="rounded-3xl bg-white p-5 shadow-card sm:p-6 {isCurrent ? 'ring-2 ring-brand-500' : ''}">
					<p class="flex items-center justify-between font-extrabold">
						{tier.name}
						{#if isCurrent}
							<span class="rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-bold text-white">Your tier</span>
						{:else}
							<span class="text-sm font-semibold text-ink-soft">{tier.at}+ pts</span>
						{/if}
					</p>
					<ul class="mt-3 space-y-1.5 text-sm text-ink-soft">
						{#each tier.perks as perk (perk)}
							<li class="flex items-start gap-2">
								<Check size={16} weight="bold" class="mt-0.5 shrink-0 text-emerald-600" /> {perk}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
			<p class="px-1 text-[13px] leading-relaxed text-ink-soft">
				Perks are demo descriptions for now — no real benefits are granted until the programme launches with the backend.
			</p>
		</aside>
	</div>
</section>
