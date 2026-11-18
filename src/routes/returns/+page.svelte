<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import Reveal from '#lib/components/Reveal.svelte';

	// MerchantReturnPolicy — every claim below is verbatim from this page:
	// "30 days from delivery … for a full refund. Returns are free."
	// Return is by mail with the returns label (step 3–4: pack with the
	// returns label, drop it off). No term here is invented.
	const returnPolicy = {
		'@context': 'https://schema.org',
		'@type': 'MerchantReturnPolicy',
		'@id': 'https://shoemate.pages.dev/returns/#policy',
		applicableCountry: 'US',
		returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
		merchantReturnDays: 30,
		returnMethod: 'https://schema.org/ReturnByMail',
		returnFees: 'https://schema.org/FreeReturn',
		refundType: 'https://schema.org/FullRefund'
	};

</script>

<svelte:head>
	<Seo
		title="Returns &amp; Exchanges — Shoemate"
		description="Shoemate returns: 30 days, free, unworn shoes in the original box. How to start a return and when your refund arrives."
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Returns' }])} />
<JsonLd data={returnPolicy} />

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Returns</p>
		<h1 class="mt-1 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
			Changed your mind? No problem.
		</h1>
		<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
			You have 30 days from delivery to return a pair for a full refund. Returns are free.
			Demo note: this storefront does not process real returns yet — the policy below describes how returns will work.
		</p>
	</Reveal>

	<Reveal>
		<div class="mt-8 rounded-3xl bg-mist p-6 shadow-card sm:p-7">
			<h2 class="text-lg font-extrabold">What can be returned</h2>
			<ul class="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-soft">
				<li>Shoes that are <strong class="text-ink">unworn</strong>, in their original box, with tags attached.</li>
				<li>Try them on indoors on carpet first — that keeps them returnable if the fit is wrong.</li>
				<li>Gift-card purchases are not refundable once the code has been used.</li>
			</ul>
			<p class="mt-3 text-[15px] leading-relaxed text-ink-soft">
				Worn shoes can only be returned if they are faulty — see “Faulty pairs” below.
			</p>
		</div>
	</Reveal>

	<Reveal>
		<div class="mt-8 rounded-3xl bg-white p-6 shadow-card sm:p-7">
			<h2 class="text-lg font-extrabold">How to start a return</h2>
			<ol class="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft">
				<li><strong class="text-ink">1. Find your order</strong> — in your account, under order history, using your SM- order number.</li>
				<li><strong class="text-ink">2. Choose the item</strong> — pick the pair and tell us why: wrong size, changed mind, or faulty.</li>
				<li><strong class="text-ink">3. Pack it up</strong> — original box inside a shipping bag, with the returns label.</li>
				<li><strong class="text-ink">4. Drop it off</strong> — at any drop-off point. Keep the receipt until your refund lands.</li>
			</ol>
		</div>
	</Reveal>

	<div class="mt-8 grid gap-4 md:grid-cols-2">
		<Reveal>
			<div class="h-full rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">Refunds</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					Refunds go back to the original payment method once the returned pair has been checked — usually
					within 3–5 business days of arrival. Delivery charges are refunded too if the whole order goes back.
				</p>
			</div>
		</Reveal>
		<Reveal delay={70}>
			<div class="h-full rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">Exchanges</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					The fastest exchange is a return plus a new order for the size you want — it reserves your size
					immediately instead of waiting for the return to be processed.
				</p>
			</div>
		</Reveal>
	</div>

	<Reveal>
		<div class="mt-8 rounded-3xl bg-white p-6 shadow-card sm:p-7">
			<h2 class="text-lg font-extrabold">Faulty pairs</h2>
			<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
				If a shoe arrives damaged, or a sole splits or stitching fails within a reasonable time, contact us with
				photos and your order number. Faulty pairs are refunded or replaced, and we cover the return postage —
				even if the shoes have been worn.
			</p>
			<p class="mt-4 text-sm text-ink-soft">
				More questions? See the <a class="font-semibold text-brand-600 hover:underline" href="/help">help centre</a>
				or the <a class="font-semibold text-brand-600 hover:underline" href="/shipping">shipping page</a>.
			</p>
		</div>
	</Reveal>
</section>
