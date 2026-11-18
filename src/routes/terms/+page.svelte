<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import Reveal from '#lib/components/Reveal.svelte';
</script>

<svelte:head>
	<Seo
		title="Terms of Service — Shoemate"
		description="Shoemate terms: this is a demo storefront — no real orders, payments or deliveries yet."
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Terms' }])} />

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Terms of service</p>
		<h1 class="mt-1 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
			Terms of service
		</h1>
		<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
			Last updated: 17 November 2026. Please read these terms before using Shoemate.
		</p>
	</Reveal>

	<div class="mt-8 space-y-4">
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">1. A demo storefront</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					Shoemate is currently a demonstration storefront. Browsing, adding to cart, wishlists and checkout are
					all simulated in your browser. No real orders are placed, no payment is taken, and no products are
					shipped. Order numbers (SM-…) are demo references stored only on your device.
				</p>
			</div>
		</Reveal>
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">2. Prices and availability</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					Prices are shown in USD. Product availability, prices and promotions shown on this demo may change
					without notice and do not form an offer to sell. Stock levels shown are illustrative.
				</p>
			</div>
		</Reveal>
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">3. Accounts</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					Sign-in is a demo stored only in your browser — there is no real account, password or server-side
					record. Do not enter real passwords or sensitive information anywhere on this site.
				</p>
			</div>
		</Reveal>
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">4. Content</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					Product descriptions, guides and blog posts are written for this demo. Testimonials on the home page
					are clearly labelled sample quotes, not real customer reviews. Brand names and trademarks belong to
					their respective owners.
				</p>
			</div>
		</Reveal>
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">5. Returns and shipping</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					The shipping and returns policies describe how the real store will operate. Because no real orders
					exist yet, no real returns can be processed. See the
					<a class="font-semibold text-brand-600 hover:underline" href="/shipping">shipping page</a> and
					<a class="font-semibold text-brand-600 hover:underline" href="/returns">returns page</a> for details.
				</p>
			</div>
		</Reveal>
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">6. Liability</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					The site is provided “as is” for demonstration purposes, without warranties of any kind. Shoemate is
					not liable for any loss arising from use of this demo.
				</p>
			</div>
		</Reveal>
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">7. Changes</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					These terms will be updated when the real store launches with accounts, payments and shipping.
					Contact: <a class="font-semibold text-brand-600 hover:underline" href="mailto:support@shoemate.example">support@shoemate.example</a>
					(a placeholder address for this demo storefront).
				</p>
			</div>
		</Reveal>
	</div>
</section>
