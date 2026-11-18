<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import { Bell, Check } from 'phosphor-svelte';
	import Reveal from '#lib/components/Reveal.svelte';
	import { drops } from '#lib/data/content';
	import { responsiveImage } from '#lib/images';

	let email = $state('');
	let subscribed = $state(false);

	function subscribe(e: SubmitEvent) {
		e.preventDefault();
		if (!email.includes('@')) return;
		try {
			const raw = localStorage.getItem('shoemate:drop-alerts');
			const list: string[] = raw ? JSON.parse(raw) : [];
			if (!list.includes(email)) list.push(email);
			localStorage.setItem('shoemate:drop-alerts', JSON.stringify(list));
		} catch {
			// Demo signup is best-effort; the success message still shows.
		}
		subscribed = true;
	}

	function fmt(date: string) {
		return new Date(date + 'T12:00:00').toLocaleDateString('en-GB', {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<Seo
		title="Drop Calendar — Shoemate"
		description="Upcoming Shoemate drops and launch dates — restocks and new colourways, with demo email alerts."
		ogImage="/images/og-cat-drops.jpg"
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Drops' }])} />

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Launch calendar</p>
		<h1 class="mt-1 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
			Upcoming drops
		</h1>
		<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
			Restocks and new colourways, in date order. Dates are planned launch dates for this demo storefront and may
			change — sign up below and we will note your interest on this device.
		</p>
	</Reveal>

	<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each drops as drop, i}
			<Reveal delay={i * 60}>
				<article class="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card">
					<img src={responsiveImage(drop.image).src} srcset={responsiveImage(drop.image).srcset} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px" alt={drop.name} loading="lazy" width="1600" height="1600" class="aspect-square w-full object-cover" />
					<div class="flex flex-1 flex-col p-5">
						<p class="text-xs font-bold tracking-widest text-brand-500 uppercase">{fmt(drop.date)} · {drop.brand}</p>
						<h2 class="mt-2 font-bold">{drop.name}</h2>
						<p class="mt-1 flex-1 text-sm leading-relaxed text-ink-soft">{drop.note}</p>
						<p class="mt-3 text-lg font-extrabold">${drop.price}.00</p>
					</div>
				</article>
			</Reveal>
		{/each}
	</div>

	<Reveal>
		<div class="mt-10 rounded-[2rem] bg-ink px-6 py-10 text-center text-white sm:px-10">
			<h2 class="text-2xl font-extrabold text-balance">Get drop alerts</h2>
			<p class="mx-auto mt-2 max-w-md text-[15px] text-white/70">
				One email when a drop goes live. Demo signup — your email is stored only in this browser, and nothing is
				actually sent yet.
			</p>
			{#if subscribed}
				<p class="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium">
					<Check size={18} class="text-brand-400" weight="bold" /> You are on the drop-alert list (demo, this device only).
				</p>
			{:else}
				<form class="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row sm:rounded-full sm:bg-white sm:p-1.5" onsubmit={subscribe}>
					<label class="sr-only" for="drop-email">Email address</label>
					<input
						id="drop-email"
						type="email"
						required
						bind:value={email}
						placeholder="Email address"
						class="h-12 w-full min-w-0 rounded-full bg-white px-5 text-base text-ink outline-none placeholder:text-ink-soft sm:w-auto sm:flex-1 sm:bg-transparent"
					/>
					<button type="submit" class="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-400">
						<Bell size={17} weight="bold" /> Notify me
					</button>
				</form>
			{/if}
		</div>
	</Reveal>
</section>
