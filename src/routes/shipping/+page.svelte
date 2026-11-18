<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import Reveal from '#lib/components/Reveal.svelte';

	// OfferShippingDetails — standard delivery only, every claim verbatim
	// from this page: US only; "2–4 business days. Free on orders over
	// $150, otherwise $9"; "placed before 2pm ship the same working day"
	// / "packed within 24 hours" (handling 0–1 days). The $14 express
	// 1–2-day option is NOT claimed here — one deliveryTime per policy.
	const shippingDetails = {
		'@context': 'https://schema.org',
		'@type': 'OfferShippingDetails',
		'@id': 'https://shoemate.pages.dev/shipping/#details',
		shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'US' },
		shippingRate: {
			'@type': 'ShippingRateSettings',
			shippingRate: { '@type': 'MonetaryAmount', value: 9, currency: 'USD' },
			freeShippingThreshold: { '@type': 'MonetaryAmount', value: 150, currency: 'USD' }
		},
		deliveryTime: {
			'@type': 'ShippingDeliveryTime',
			handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
			transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 4, unitCode: 'DAY' }
		}
	};

</script>

<svelte:head>
	<Seo
		title="Shipping — Shoemate"
		description="Shoemate shipping: free standard delivery over $150, express 1–2 days, and what to expect after you order."
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Shipping' }])} />
<JsonLd data={shippingDetails} />

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Shipping</p>
		<h1 class="mt-1 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
			Shipping, plain and simple
		</h1>
		<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
			We currently ship within the United States only. Orders placed before 2pm ship the same working day.
			Demo note: this storefront does not ship real orders yet — the policy below describes how shipping will work.
		</p>
	</Reveal>

	<div class="mt-8 grid gap-4 md:grid-cols-2">
		<Reveal>
			<div class="h-full rounded-3xl bg-mist p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">Standard delivery</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					<strong class="text-ink">2–4 business days.</strong> Free on orders over $150, otherwise $9.
					Every order is tracked door to door, and you get a tracking link as soon as your pair leaves our warehouse.
				</p>
			</div>
		</Reveal>
		<Reveal delay={70}>
			<div class="h-full rounded-3xl bg-mist p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">Express delivery</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					<strong class="text-ink">1–2 business days, $14.</strong> Choose it at checkout when you need a pair
					for the weekend. Express orders placed before 2pm ship the same day.
				</p>
			</div>
		</Reveal>
	</div>

	<Reveal>
		<div class="mt-8 rounded-3xl bg-white p-6 shadow-card sm:p-7">
			<h2 class="text-lg font-extrabold">How it works</h2>
			<ol class="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft">
				<li><strong class="text-ink">1. Order confirmed</strong> — you get an order number (SM-…) right after checkout.</li>
				<li><strong class="text-ink">2. Packed within 24 hours</strong> — every pair is checked by hand before it is boxed.</li>
				<li><strong class="text-ink">3. Shipped with tracking</strong> — a tracking link follows your parcel to your door.</li>
				<li><strong class="text-ink">4. Delivered</strong> — no signature needed for standard delivery unless you ask for one.</li>
			</ol>
		</div>
	</Reveal>

	<Reveal>
		<div class="mt-8 rounded-3xl bg-white p-6 shadow-card sm:p-7">
			<h2 class="text-lg font-extrabold">Good to know</h2>
			<ul class="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-soft">
				<li>We ship Monday to Saturday, excluding public holidays.</li>
				<li>Delivery times count business days from dispatch, not from ordering.</li>
				<li>If a parcel is delayed, the tracking page is the fastest source of truth — or check your order status in your account.</li>
				<li>Wrong address? Contact us as soon as possible — once a parcel has shipped we cannot change the destination.</li>
			</ul>
			<p class="mt-4 text-sm text-ink-soft">
				Questions? See the <a class="font-semibold text-brand-600 hover:underline" href="/help">help centre</a>
				or the <a class="font-semibold text-brand-600 hover:underline" href="/returns">returns page</a>.
			</p>
		</div>
	</Reveal>
</section>
