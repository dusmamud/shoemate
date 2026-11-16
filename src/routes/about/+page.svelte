<script lang="ts">
	import type { Component } from 'svelte';
	import { ArrowRight, MapPin, ShieldCheck, Sneaker, Star, Truck } from 'phosphor-svelte';
	import Reveal from '#lib/components/Reveal.svelte';

	const values: [Component, string, string][] = [
		[Sneaker, 'Authentic, always', 'Every pair is sourced directly from brands and authorised distributors — and verified before dispatch.'],
		[Truck, 'Fast, tracked delivery', 'Orders ship within 24 hours with live tracking, free over $150.'],
		[ShieldCheck, 'Easy 30-day returns', 'Wrong size? Wrong colour? Send it back free within 30 days.']
	];

	const stats: [string, string][] = [
		['15K+', 'Happy customers'],
		['5K+', 'Premium products'],
		['120+', 'Brands in store'],
		['4.9', 'Average rating']
	];

	const stores = [
		{ city: 'Portland, OR', address: '214 Runner Street', hours: 'Mon–Sat · 9am–9pm' },
		{ city: 'New York, NY', address: '88 Marathon Avenue', hours: 'Mon–Sun · 10am–10pm' },
		{ city: 'Los Angeles, CA', address: '7 Sunset Strip', hours: 'Mon–Sat · 10am–9pm' }
	];
</script>

<svelte:head>
	<title>About Shoemate — Our Story</title>
	<meta name="description" content="Shoemate started with one belief: great sneakers should be easy to buy. Read our story." />
</svelte:head>

<section class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">About</p>
		<h1 class="mt-1 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
			Sneakers are not just shoes. They are how you show up.
		</h1>
	</Reveal>

	<div id="story" class="mt-8 grid items-center gap-8 lg:grid-cols-2">
		<Reveal>
			<img
				src="/images/about-story.png"
				alt="Inside a Shoemate store — shelves of colourful sneakers"
				loading="lazy"
				width="2048"
				height="1152"
				class="w-full rounded-[2rem] object-cover shadow-card"
			/>
		</Reveal>
		<Reveal delay={90}>
			<div>
				<h2 class="text-2xl font-extrabold">Our story</h2>
				<p class="mt-3 text-[15px] leading-relaxed text-ink-soft">
					Shoemate started in 2021 with a tiny shelf of 40 pairs and one belief: buying great sneakers should feel as good as wearing them. No fake
					discounts, no mystery sizing, no waiting weeks for delivery.
				</p>
				<p class="mt-3 text-[15px] leading-relaxed text-ink-soft">
					Today we carry 5,000+ styles from 120 brands, every pair checked by hand before it ships. What has not changed is the rule we started
					with — if we would not wear it ourselves, we do not sell it.
				</p>
				<div class="mt-6 grid grid-cols-2 gap-3">
					{#each stats as [num, label]}
						<div class="rounded-3xl bg-white p-5 shadow-card">
							<p class="text-2xl font-extrabold text-brand-500">{num}</p>
							<p class="mt-0.5 text-sm text-ink-soft">{label}</p>
						</div>
					{/each}
				</div>
			</div>
		</Reveal>
	</div>

	<div class="mt-14 grid gap-4 md:grid-cols-3">
		{#each values as [Icon, title, text], i}
			<Reveal delay={i * 60}>
				<div class="h-full rounded-3xl bg-white p-6 shadow-card">
					<span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
						<Icon size={24} weight="duotone" />
					</span>
					<h3 class="mt-4 font-bold">{title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-ink-soft">{text}</p>
				</div>
			</Reveal>
		{/each}
	</div>

	<div id="stores" class="mt-14">
		<Reveal>
			<h2 class="text-2xl font-extrabold">Visit a store</h2>
			<p class="mt-1 text-[15px] text-ink-soft">Try them on, talk to a real sneakerhead, walk out wearing them.</p>
		</Reveal>
		<div class="mt-6 grid gap-4 md:grid-cols-3">
			{#each stores as store, i}
				<Reveal delay={i * 60}>
					<div class="rounded-3xl bg-white p-6 shadow-card">
						<p class="flex items-center gap-2 font-bold"><MapPin size={19} class="text-brand-500" /> {store.city}</p>
						<p class="mt-2 text-sm text-ink-soft">{store.address}</p>
						<p class="mt-1 text-sm text-ink-soft">{store.hours}</p>
						<a href="/shop" class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-500">
							Shop this city’s picks <ArrowRight size={15} weight="bold" />
						</a>
					</div>
				</Reveal>
			{/each}
		</div>
	</div>

	<Reveal>
		<div class="mt-14 flex flex-col items-center justify-between gap-4 rounded-[2rem] bg-ink px-8 py-10 text-center text-white sm:flex-row sm:text-left">
			<div>
				<h2 class="text-2xl font-extrabold">Ready to find your pair?</h2>
				<p class="mt-1 text-sm text-white/70">New drops land every Friday. Members shop them first.</p>
			</div>
			<a href="/new-arrivals" class="flex h-12 shrink-0 items-center gap-2 rounded-full bg-brand-500 px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-400">
				Shop new arrivals <ArrowRight size={17} weight="bold" />
			</a>
		</div>
	</Reveal>
</section>
