<script lang="ts">
	import Reveal from '#lib/components/Reveal.svelte';
</script>

<svelte:head>
	<title>Privacy Policy — Shoemate</title>
	<meta
		name="description"
		content="Shoemate privacy policy: what this demo store stores (localStorage only, no tracking yet) and what it never collects."
	/>
</svelte:head>

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Privacy policy</p>
		<h1 class="mt-1 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
			Privacy policy
		</h1>
		<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
			Last updated: 17 November 2026. This is a demo storefront. This policy describes what the site does today —
			and what it does not do yet.
		</p>
	</Reveal>

	<div class="mt-8 space-y-4">
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">What we store — and where</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					Your cart, wishlist, recently viewed products, demo sign-in and drop-alert signups are stored only in
					your own browser, using localStorage. Nothing is sent to a server, because there is no server yet.
					Clear your browser data and it is all gone.
				</p>
			</div>
		</Reveal>
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">What we do not collect</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					We run no analytics, no advertising trackers and no third-party cookies. We do not collect your name,
					address or payment details — checkout is a demo and takes no real payment. Newsletter and drop-alert
					emails are stored only in your browser for now; they are never sent anywhere.
				</p>
			</div>
		</Reveal>
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">Cookies</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					The site does not set tracking cookies. The small notice you see on your first visit is about
					localStorage, not cookies — dismiss it and it stays dismissed on this device. See the accessibility
					page for how the site works with assistive technology.
				</p>
			</div>
		</Reveal>
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">When the real store launches</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					Real accounts, orders, payments and email will need a backend. When that lands, this policy will be
					updated to say exactly what is collected, why, and how to delete it — before any of it goes live.
				</p>
			</div>
		</Reveal>
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">Contact</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					Privacy questions: <a class="font-semibold text-brand-600 hover:underline" href="mailto:support@shoemate.example">support@shoemate.example</a>
					— a placeholder address for this demo storefront. There is no live inbox yet.
				</p>
			</div>
		</Reveal>
	</div>
</section>
