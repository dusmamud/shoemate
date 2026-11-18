<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import Reveal from '#lib/components/Reveal.svelte';

	const groups: { title: string; note: string; faqs: { q: string; a: string }[] }[] = [
		{
			title: 'Fit & sizing',
			note: 'How shoes fit, and how to pick the right size.',
			faqs: [
				{
					q: 'How do Shoemate sizes run?',
					a: 'Most of our shoes run true to size. A few models run narrow or short — check the fit note on the product page before ordering. If you are between sizes, the size guide page has a UK / EU / US conversion table and foot-measurement instructions.'
				},
				{
					q: 'Where is the size guide?',
					a: 'On the size guide page, linked from every product page and from the footer. It covers measuring your foot at home and converting between UK, EU and US sizes.'
				},
				{
					q: 'What if my size is out of stock?',
					a: 'Sizes that are out of stock are shown disabled on the product page, so you can see at a glance what is available. We do not take orders for sizes we do not have.'
				}
			]
		},
		{
			title: 'Orders & stock',
			note: 'Ordering, payment and what happens after you check out.',
			faqs: [
				{
					q: 'Do I need an account to order?',
					a: 'No. Checkout works as a guest — you can order without creating an account. Signing in is optional and only saves your details on this device for now.'
				},
				{
					q: 'Is checkout real? Will I be charged?',
					a: 'This is a demo storefront. Checkout does not take real payment and no order is sent to a warehouse. Orders are saved only in your browser (localStorage) so you can see them in your account area.'
				},
				{
					q: 'Where is my order confirmation?',
					a: 'After checkout you get an order number starting with SM-. Because this is a demo, nothing is emailed — your order is stored on this device and listed under your account.'
				}
			]
		},
		{
			title: 'Shipping',
			note: 'Delivery times, costs and tracking.',
			faqs: [
				{
					q: 'How much is delivery?',
					a: 'Standard delivery is free on orders over $150 and $9 below that. Express delivery (1–2 days) is available at checkout. Full details are on the shipping page.'
				},
				{
					q: 'How long will my order take?',
					a: 'Standard delivery takes 2–4 business days, express takes 1–2. Orders placed before 2pm ship the same working day.'
				},
				{
					q: 'Do you ship internationally?',
					a: 'Not yet. We currently ship within the United States only. International shipping is planned once the real store launches.'
				}
			]
		},
		{
			title: 'Returns & exchanges',
			note: 'Changing your mind, wrong sizes and faulty pairs.',
			faqs: [
				{
					q: 'Can I return shoes I have worn?',
					a: 'Shoes must be unworn and in their original box for a return. Try them on indoors on carpet — if they do not fit, send them back within 30 days for a full refund.'
				},
				{
					q: 'How do I start a return?',
					a: 'See the returns page for the step-by-step process. Returns are free, and refunds go back to the original payment method once the pair is checked.'
				},
				{
					q: 'Can I exchange for a different size?',
					a: 'Yes — start a return and place a new order for the size you want. That is faster than waiting for an exchange to be processed, and it guarantees your size is reserved.'
				}
			]
		},
		{
			title: 'Promo codes',
			note: 'Discounts, deals and gift cards.',
			faqs: [
				{
					q: 'What promo codes work?',
					a: 'SHOEMATE10 gives 10% off your order. Enter it at checkout — if a code is not valid, checkout will tell you straight away.'
				},
				{
					q: 'Can I use more than one code?',
					a: 'No, one promo code per order. The best available discount applies automatically on the deals page.'
				},
				{
					q: 'Do you sell gift cards?',
					a: 'Yes — see the gift cards page. Gift card codes are demo codes for now and are redeemed at checkout like SHOEMATE10.'
				}
			]
		},
		{
			title: 'Account & privacy',
			note: 'Your data, your account, and this demo store.',
			faqs: [
				{
					q: 'What data does Shoemate store about me?',
					a: 'Almost nothing. Your cart, wishlist and demo sign-in live only in your own browser (localStorage). We run no analytics and no tracking yet. See the privacy page for the full picture.'
				},
				{
					q: 'I forgot my password — how do I reset it?',
					a: 'Sign-in is a demo stored on this device, so there is no real password to reset. If you are signed out, just sign in again with any email — nothing is checked against a server.'
				},
				{
					q: 'How do I contact support?',
					a: 'Email support@shoemate.example — please note this is a placeholder address for the demo storefront, shown so you can see where contact details will go. There is no live support inbox yet.'
				}
			]
		}
	];
</script>

<svelte:head>
	<Seo
		title="Help Centre — Shoemate"
		description="Answers on fit, sizing, shipping, returns, promo codes and orders — the Shoemate help centre."
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Help Centre' }])} />

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Help centre</p>
		<h1 class="mt-1 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
			How can we help?
		</h1>
		<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
			Answers to the questions we get most — fit, stock, shipping, returns and promo codes. Still stuck?
			Email <a class="font-semibold text-brand-600 hover:underline" href="mailto:support@shoemate.example">support@shoemate.example</a>
			(a placeholder address for this demo storefront).
		</p>
	</Reveal>

	<div class="mt-8 grid gap-4 lg:grid-cols-2">
		{#each groups as group}
			<Reveal>
				<div class="h-full rounded-3xl bg-mist p-6 shadow-card sm:p-7">
					<h2 class="text-lg font-extrabold">{group.title}</h2>
					<p class="mt-1 text-sm text-ink-soft">{group.note}</p>
					<div class="mt-4 space-y-2">
						{#each group.faqs as faq}
							<details class="group rounded-2xl bg-white px-4 py-3 shadow-card">
								<summary class="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold marker:hidden">
									{faq.q}
									<span aria-hidden="true" class="shrink-0 text-lg font-bold text-brand-500 transition-transform group-open:rotate-45">+</span>
								</summary>
								<p class="pt-1 pb-1 text-sm leading-relaxed text-ink-soft">{faq.a}</p>
							</details>
						{/each}
					</div>
				</div>
			</Reveal>
		{/each}
	</div>

	<Reveal>
		<div class="mt-8 rounded-3xl bg-ink px-6 py-8 text-white sm:px-8">
			<h2 class="text-xl font-extrabold">Need the full policy?</h2>
			<p class="mt-1 text-sm text-white/70">Shipping times, return steps and sizing tables live on their own pages.</p>
			<div class="mt-4 flex flex-wrap gap-2">
				<a href="/shipping" class="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-brand-500 hover:text-white">Shipping</a>
				<a href="/returns" class="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-brand-500 hover:text-white">Returns</a>
				<a href="/size-guide" class="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-brand-500 hover:text-white">Size guide</a>
				<a href="/fit-finder" class="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-brand-500 hover:text-white">Fit finder</a>
			</div>
		</div>
	</Reveal>
</section>
