<script lang="ts">
	import type { Component } from 'svelte';
	import { ArrowRight, ArrowCounterClockwise, Fire, Headset, ShieldCheck, Sneaker, Star, Truck } from 'phosphor-svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Reveal from '#lib/components/Reveal.svelte';
	import { categories, heroProduct, products } from '#lib/data/products';

	const latest = products.slice(0, 4);
	const bestsellers = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
	const brands = ['Nike', 'Adidas', 'New Balance', 'ASICS', 'Puma', 'Jordan', 'Vans', 'Converse', 'Reebok', 'Saucony', 'Fila', 'Yeezy'];

	const testimonials = [
		{
			name: 'Aarav Mehta',
			role: 'Verified Buyer · Mumbai',
			text: 'The Air Max DN fits like it was made for me. Delivery was faster than promised and the packaging felt premium.',
			rating: 5
		},
		{
			name: 'Sofia D’Souza',
			role: 'Verified Buyer · Bengaluru',
			text: 'Ordered on Monday, ran a 10K in them on Saturday. Zero break-in needed — easily the most comfortable pair I own.',
			rating: 5
		},
		{
			name: 'Rohan Kapoor',
			role: 'Verified Buyer · Delhi',
			text: 'Third pair from Shoemate. Prices beat every other store I checked, and the size guide is actually accurate.',
			rating: 4
		}
	];

	// Deals countdown: ends ~2 days from first render (demo).
	// Started in $effect so the server render and the first client render agree (00:00:00:00).
	let target = $state(0);
	let now = $state(0);
	$effect(() => {
		target = Date.now() + (2 * 24 * 3600 + 14 * 3600 + 22 * 60) * 1000;
		now = Date.now();
		const id = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(id);
	});
	let diff = $derived(Math.max(0, target - now));
	let cd = $derived({
		d: Math.floor(diff / 86400000),
		h: Math.floor((diff / 3600000) % 24),
		m: Math.floor((diff / 60000) % 60),
		s: Math.floor((diff / 1000) % 60)
	});
	const pad = (n: number) => String(n).padStart(2, '0');
	const features: [Component, string, string][] = [
		[Truck, 'Free fast shipping', 'Free delivery on orders over $150, tracked door to door.'],
		[ShieldCheck, 'Secure checkout', 'Encrypted payments with all major cards and wallets.'],
		[ArrowCounterClockwise, '30-day returns', 'Changed your mind? Easy returns, no questions asked.'],
		[Headset, 'Real human support', 'Sneaker experts on chat 7 days a week, 9am–9pm.']
	];
	let countdown = $derived(
		[
			[cd.d, 'Days'],
			[cd.h, 'Hours'],
			[cd.m, 'Mins'],
			[cd.s, 'Secs']
		] as [number, string][]
	);
</script>

<svelte:head>
	<title>Shoemate — Upgrade Your Style With Premium Essentials</title>
</svelte:head>

<!-- ============ HERO ============ -->
<section class="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10 lg:px-8">
	<div class="relative overflow-hidden rounded-[2rem] bg-white px-4 py-10 shadow-card sm:px-8 sm:py-14">
		<span aria-hidden="true" class="text-outline-year pointer-events-none absolute top-3 right-3 hidden text-[6.5rem] leading-[1.05] font-extrabold tracking-tighter select-none [writing-mode:vertical-rl] xl:block">
			2026
		</span>

		<div class="relative text-center">
			<p class="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-500 sm:text-base">
				<Fire size={19} weight="fill" /> Summer Collection 2026
			</p>
			<h1 class="mx-auto mt-3 max-w-3xl text-[2rem] leading-[1.12] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
				Upgrade Your Style With Premium Essentials
			</h1>
		</div>

		<div class="relative mt-8 grid items-center gap-8 lg:mt-4 lg:grid-cols-[minmax(0,240px)_1fr_minmax(0,240px)] lg:gap-4">
			<div class="order-2 mx-auto max-w-md text-center lg:order-1 lg:mx-0 lg:max-w-none lg:text-left">
				<p class="text-[15px] leading-relaxed text-ink-soft">
					Shop the latest arrivals with fast delivery and exclusive offers.
				</p>
				<div class="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
					<a
						href="/shop"
						class="flex h-12 items-center gap-2 rounded-full bg-brand-500 px-6 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5 hover:bg-brand-600"
					>
						Shop Now <ArrowRight size={17} weight="bold" />
					</a>
					<a
						href="/categories"
						class="flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-500"
					>
						Explore Collection
					</a>
				</div>
			</div>

			<div class="relative order-1 lg:order-2">
				<div aria-hidden="true" class="hero-glow absolute inset-x-8 top-1/2 aspect-[4/3] -translate-y-1/2 rounded-full blur-2xl sm:inset-x-16"></div>
				<img
					src={heroProduct.image}
					alt="Velocity Runner X1 — white and grey sneaker with a bright orange sole"
					width="1920"
					height="1280"
					fetchpriority="high"
					class="animate-float relative mx-auto w-full max-w-[560px] drop-shadow-[0_28px_28px_rgb(22_19_15/0.18)]"
				/>
			</div>

			<div class="order-3 mx-auto flex w-full max-w-sm flex-col gap-3 lg:mx-0 lg:max-w-none">
				{#each [['15K+', 'Happy Customers'], ['5K+', 'Premium Products']] as [num, label]}
					<div class="flex items-center gap-3 rounded-2xl bg-mist px-4 py-3">
						<span class="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-sm font-extrabold text-white">{num}</span>
						<span class="text-sm font-medium">{label}</span>
					</div>
				{/each}
				<div class="flex items-center gap-3 rounded-2xl bg-mist px-4 py-3">
					<span class="flex h-11 w-14 shrink-0 items-center justify-center gap-0.5 rounded-xl bg-brand-500 text-sm font-extrabold text-white">
						4.9 <Star size={14} weight="fill" />
					</span>
					<span class="text-sm font-medium">Customer Rating</span>
				</div>
				<p class="pt-1 text-center text-sm text-ink-soft lg:text-right">
					Price: <a href="/product/{heroProduct.slug}" class="text-lg font-bold text-ink hover:text-brand-600">${heroProduct.price}.00</a>
				</p>
			</div>
		</div>
	</div>
</section>

<!-- ============ BRAND MARQUEE ============ -->
<section aria-label="Brands we carry" class="mt-10 overflow-hidden border-y border-line/70 bg-white/60 py-4">
	<div class="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
		{#each [...brands, ...brands] as brand}
			<span class="flex items-center gap-10 text-sm font-bold tracking-[0.22em] text-ink/40 uppercase">
				{brand} <Sneaker size={18} weight="fill" class="text-brand-500/70" />
			</span>
		{/each}
	</div>
</section>

<!-- ============ CATEGORIES ============ -->
<section class="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
	<Reveal>
		<div class="flex items-end justify-between gap-4">
			<h2 class="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">Our Categories</h2>
			<a href="/categories" class="hidden items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-brand-600 sm:inline-flex">
				View all <ArrowRight size={16} weight="bold" />
			</a>
		</div>
	</Reveal>

	<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<Reveal class="sm:row-span-2">
			<a
				href="/categories"
				class="group relative block h-full min-h-[420px] overflow-hidden rounded-3xl shadow-card transition-shadow hover:shadow-lift lg:min-h-[560px]"
				style="background: {categories[0].bg}"
			>
				<img
					src={categories[0].image}
					alt={categories[0].name}
					loading="lazy"
					width="1344"
					height="1792"
					class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
				/>
				<span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent p-5 pt-20 text-white">
					<span class="text-xl font-bold">{categories[0].name}</span>
					<span class="mt-0.5 block text-sm text-white/80">{categories[0].tagline}</span>
					<span class="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-ink transition-colors group-hover:bg-brand-500 group-hover:text-white">
						{categories[0].cta} <ArrowRight size={15} weight="bold" />
					</span>
				</span>
			</a>
		</Reveal>

		<Reveal delay={80} class="lg:col-span-2">
			<a
				href="/categories"
				class="group relative block h-full min-h-[220px] overflow-hidden rounded-3xl shadow-card transition-shadow hover:shadow-lift lg:min-h-[272px]"
				style="background: {categories[1].bg}"
			>
				<img
					src={categories[1].image}
					alt={categories[1].name}
					loading="lazy"
					width="2048"
					height="1152"
					class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
				/>
				<span aria-hidden="true" class="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 via-black/20 to-transparent"></span>
				<span class="absolute right-0 bottom-0 p-5 text-right text-white drop-shadow">
					<span class="text-lg font-bold sm:text-xl">{categories[1].name}</span>
					<span class="mt-0.5 block text-sm text-white/85">{categories[1].tagline} →</span>
				</span>
			</a>
		</Reveal>

		{#each categories.slice(2) as cat, i}
			<Reveal delay={120 + i * 60}>
				<a
					href="/categories"
					class="group relative block h-full min-h-[220px] overflow-hidden rounded-3xl shadow-card transition-shadow hover:shadow-lift"
					style="background: {cat.bg}"
				>
					<img
						src={cat.image}
						alt={cat.name}
						loading="lazy"
						width="1600"
						height="1600"
						class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
					/>
					<span class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-5 pt-14 text-white">
						<span class="text-lg font-bold">{cat.name}</span>
						<span class="mt-0.5 block text-sm text-white/85">{cat.tagline} →</span>
					</span>
				</a>
			</Reveal>
		{/each}
	</div>
</section>

<!-- ============ LATEST PRODUCTS ============ -->
<section class="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
	<Reveal>
		<div class="flex items-end justify-between gap-4">
			<h2 class="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">Latest Products</h2>
			<a href="/shop" class="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-brand-600">
				Browse All Products <ArrowRight size={16} weight="bold" />
			</a>
		</div>
	</Reveal>
	<div class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
		{#each latest as product, i}
			<Reveal delay={i * 70}>
				<ProductCard {product} />
			</Reveal>
		{/each}
	</div>
</section>

<!-- ============ DEALS BANNER ============ -->
<section class="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
	<Reveal>
		<div class="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-white sm:px-10 lg:px-14">
			<div aria-hidden="true" class="hero-glow absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-70 blur-3xl"></div>
			<div class="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
				<div>
					<p class="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold tracking-widest uppercase">
						<Fire size={15} weight="fill" /> Limited time deal
					</p>
					<h2 class="mt-4 text-3xl leading-tight font-extrabold text-balance sm:text-4xl">Up to 30% off bestsellers this week</h2>
					<p class="mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
						Deals on the pairs everyone wants — when they are gone, they are gone. Members check out first.
					</p>
					<div class="mt-6 flex items-center gap-2 sm:gap-3" role="timer" aria-label="Deal ends in {cd.d} days, {cd.h} hours, {cd.m} minutes">
						{#each countdown as [val, label]}
							<div class="min-w-[68px] rounded-2xl bg-white/10 px-3 py-2.5 text-center backdrop-blur">
								<span class="block text-2xl font-extrabold tabular-nums">{pad(val)}</span>
								<span class="text-[11px] font-medium tracking-widest text-white/60 uppercase">{label}</span>
							</div>
						{/each}
					</div>
					<a
						href="/deals"
						class="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-brand-500 px-7 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-400"
					>
						Shop the deals <ArrowRight size={17} weight="bold" />
					</a>
				</div>
				<div class="relative mx-auto hidden w-full max-w-sm lg:block">
					<img
						src="/images/prod-jordan.png"
						alt="Air Jordan 1 Mid — white and red high-top sneaker"
						loading="lazy"
						width="1600"
						height="1600"
						class="animate-float w-full rounded-[2rem] object-cover shadow-2xl"
					/>
					<span class="absolute top-4 left-4 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-ink">SAVE $60 · AIR JORDAN 1 MID</span>
				</div>
			</div>
		</div>
	</Reveal>
</section>

<!-- ============ BESTSELLERS ============ -->
<section class="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
	<Reveal>
		<div class="flex items-end justify-between gap-4">
			<h2 class="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">Bestsellers</h2>
			<a href="/shop?sort=bestsellers" class="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-brand-600">
				Shop bestsellers <ArrowRight size={16} weight="bold" />
			</a>
		</div>
	</Reveal>
	<div class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
		{#each bestsellers.slice(0, 4) as product, i}
			<Reveal delay={i * 70}>
				<ProductCard {product} />
			</Reveal>
		{/each}
	</div>
</section>

<!-- ============ WHY SHOEMATE ============ -->
<section class="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each features as [Icon, title, text], i}
			<Reveal delay={i * 60}>
				<div class="h-full rounded-3xl bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
					<span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
						<Icon size={24} weight="duotone" />
					</span>
					<h3 class="mt-4 font-bold">{title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-ink-soft">{text}</p>
				</div>
			</Reveal>
		{/each}
	</div>
</section>

<!-- ============ TESTIMONIALS ============ -->
<section class="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
	<Reveal>
		<h2 class="text-xl font-extrabold tracking-tight uppercase sm:text-2xl">Loved by 15,000+ sneakerheads</h2>
	</Reveal>
	<div class="mt-6 grid gap-4 md:grid-cols-3">
		{#each testimonials as t, i}
			<Reveal delay={i * 70}>
				<figure class="flex h-full flex-col rounded-3xl bg-white p-6 shadow-card">
					<div class="flex gap-0.5" aria-label="Rated {t.rating} out of 5">
						{#each Array(t.rating) as _}
							<Star size={17} weight="fill" class="text-amber-400" />
						{/each}
					</div>
					<blockquote class="mt-3 flex-1 text-[15px] leading-relaxed">“{t.text}”</blockquote>
					<figcaption class="mt-4 border-t border-line pt-4">
						<p class="text-sm font-bold">{t.name}</p>
						<p class="text-xs text-ink-soft">{t.role}</p>
					</figcaption>
				</figure>
			</Reveal>
		{/each}
	</div>
</section>

<!-- ============ NEWSLETTER ============ -->
<section class="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
	<Reveal>
		<div class="rounded-[2rem] bg-brand-500 px-6 py-10 text-center text-white sm:px-10">
			<h2 class="text-2xl font-extrabold text-balance sm:text-3xl">Get 10% off your first order</h2>
			<p class="mx-auto mt-2 max-w-md text-[15px] text-white/85">Join the list for drops, restocks and members-only deals. One email a week, no spam.</p>
			<form
				class="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row sm:rounded-full sm:bg-white sm:p-1.5"
				onsubmit={(e) => {
					e.preventDefault();
					const input = e.currentTarget.querySelector('input');
					if (input) input.value = '';
					alert('Welcome to Shoemate! Your 10% code is on its way.');
				}}
			>
				<label class="sr-only" for="newsletter-email">Email address</label>
				<input
					id="newsletter-email"
					type="email"
					required
					placeholder="Email address"
					class="h-12 flex-1 rounded-full bg-white px-5 text-sm text-ink outline-none placeholder:text-ink-soft sm:bg-transparent"
				/>
				<button type="submit" class="h-12 shrink-0 rounded-full bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-ink/80 sm:hover:bg-brand-600">
					Claim 10% off
				</button>
			</form>
		</div>
	</Reveal>
</section>
