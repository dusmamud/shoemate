<script lang="ts">
	import Reveal from '#lib/components/Reveal.svelte';
	import { SIZE_TABLE } from '#lib/data/products';

	const rows = SIZE_TABLE;
</script>

<svelte:head>
	<title>Size Guide — Shoemate</title>
	<meta
		name="description"
		content="Shoemate size guide: UK, EU and US conversion table plus how to measure your foot at home."
	/>
</svelte:head>

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Size guide</p>
		<h1 class="mt-1 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
			Find your size
		</h1>
		<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
			Sizes vary a little between brands, so measure your foot and check the table. When in doubt for running
			shoes, go up half a size — feet swell on longer runs.
		</p>
	</Reveal>

	<Reveal>
		<div class="mt-8 overflow-x-auto rounded-3xl bg-white shadow-card">
			<table class="w-full min-w-[480px] text-left text-[15px]">
				<caption class="sr-only">UK, EU and US size conversion with foot length</caption>
				<thead>
					<tr class="border-b border-line text-sm text-ink-soft">
						<th scope="col" class="px-5 py-4 font-semibold">UK</th>
						<th scope="col" class="px-5 py-4 font-semibold">EU</th>
						<th scope="col" class="px-5 py-4 font-semibold">US men’s</th>
						<th scope="col" class="px-5 py-4 font-semibold">Foot length</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as row, i}
						<tr class={i % 2 ? 'bg-mist/60' : ''}>
							<th scope="row" class="px-5 py-3.5 font-bold">{row.uk}</th>
							<td class="px-5 py-3.5">{row.eu}</td>
							<td class="px-5 py-3.5">{row.us}</td>
							<td class="px-5 py-3.5">{row.cm}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="mt-3 text-sm text-ink-soft">
			Approximate conversions for men’s sizing. Women’s and kids’ sizing differs — check the product page fit note.
		</p>
	</Reveal>

	<div class="mt-8 grid gap-4 md:grid-cols-2">
		<Reveal>
			<div class="h-full rounded-3xl bg-mist p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">How to measure your foot</h2>
				<ol class="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-ink-soft">
					<li>Stand on a sheet of paper, wearing the socks you will run or walk in.</li>
					<li>Trace around your foot, keeping the pen upright.</li>
					<li>Measure from the back of the heel to the tip of your longest toe, in centimetres.</li>
					<li>Do both feet and use the longer measurement.</li>
					<li>Measure in the afternoon — feet are slightly bigger later in the day.</li>
				</ol>
			</div>
		</Reveal>
		<Reveal delay={70}>
			<div class="h-full rounded-3xl bg-mist p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">Fit tips</h2>
				<ul class="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-soft">
					<li>Leave about a thumb’s width (1 cm) between your longest toe and the end of the shoe.</li>
					<li>If you are between sizes for running, take the larger one.</li>
					<li>Width matters as much as length — if the upper bulges at the sides, you need a wider fit, not a longer shoe.</li>
					<li>Check the fit note on each product page: some models run narrow or short.</li>
				</ul>
				<p class="mt-4 text-sm">
					<a class="font-semibold text-brand-600 hover:underline" href="/fit-finder">Try the fit finder →</a>
					<span class="text-ink-soft"> — answer three questions and get a recommended UK size.</span>
				</p>
			</div>
		</Reveal>
	</div>
</section>
