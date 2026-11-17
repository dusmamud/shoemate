<script lang="ts">
	import Reveal from '#lib/components/Reveal.svelte';
	import { SIZE_TABLE } from '#lib/data/products';

	// Foot length (cm) → UK size, approximate. Sizing varies by brand and model.
	// Derived from the shared SIZE_TABLE — same numbers as the size guide page.
	const table: [number, string][] = SIZE_TABLE.map((r) => [parseFloat(r.cm), r.uk]);
	const ukSizes = SIZE_TABLE.map((r) => r.uk);

	let footCm = $state('');
	let usualSize = $state('');
	let fit = $state('regular');
	let result = $state<string | null>(null);
	let note = $state('');

	function find() {
		const cm = parseFloat(footCm);
		if (!cm || cm < 20 || cm > 32) {
			result = null;
			note = 'Enter a foot length between 20 and 32 cm — measure from heel to longest toe (see the size guide).';
			return;
		}
		let nearest = table[0];
		for (const row of table) {
			if (Math.abs(row[0] - cm) < Math.abs(nearest[0] - cm)) nearest = row;
		}
		let idx = table.findIndex((r) => r[1] === nearest[1]);
		if (fit === 'roomy') idx = Math.min(table.length - 1, idx + 1);
		// 'snug' and 'regular' both keep the measured size.
		const size = table[idx][1];
		result = size;
		const notes: string[] = [];
		if (fit === 'roomy') notes.push('sized up half a step for a roomier feel');
		if (fit === 'snug') notes.push('kept to your measured size for a snug fit');
		if (usualSize && usualSize !== size) {
			const diff = ukSizes.indexOf(size) - ukSizes.indexOf(usualSize);
			notes.push(
				diff > 0
					? `that is ${diff === 1 ? 'half a size' : diff + ' sizes'} up from your usual ${usualSize} — your measured foot suggests going up`
					: `that is below your usual ${usualSize} — double-check your measurement, or stick with what you know fits`
			);
		}
		if (cm < 25.0 || cm > 28.5) notes.push('your foot is outside the UK 6–11 range we stock — the nearest stocked size is shown');
		note = notes.length ? `Recommended ${size} (${notes.join('; ')}).` : `Recommended ${size}.`;
	}
</script>

<svelte:head>
	<title>Fit Finder — Shoemate</title>
	<meta
		name="description"
		content="Find your shoe size in three questions: foot length, usual size and fit preference. A guide, not a guarantee."
	/>
</svelte:head>

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Fit finder</p>
		<h1 class="mt-1 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
			Find my size
		</h1>
		<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
			Three quick questions, one recommended UK size. This is a guide based on average sizing — brands differ, so
			check the fit note on the product page too. It is not a guarantee of fit.
		</p>
	</Reveal>

	<div class="mt-8 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
		<Reveal>
			<form
				class="rounded-3xl bg-white p-6 shadow-card sm:p-7"
				onsubmit={(e) => {
					e.preventDefault();
					find();
				}}
			>
				<div>
					<label for="foot-cm" class="text-sm font-bold">1. Your foot length (cm)</label>
					<p class="mt-0.5 text-sm text-ink-soft">Stand on paper, measure heel to longest toe. See the size guide for the full method.</p>
					<input
						id="foot-cm"
						type="number"
						inputmode="decimal"
						min="20"
						max="32"
						step="0.1"
						required
						bind:value={footCm}
						placeholder="e.g. 26.4"
						class="mt-2 h-12 w-full rounded-2xl border border-line bg-mist px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
					/>
				</div>

				<fieldset class="mt-6">
					<legend class="text-sm font-bold">2. Your usual UK size</legend>
					<p class="mt-0.5 text-sm text-ink-soft">Optional — helps us flag when the measurement disagrees with what you normally wear.</p>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each ukSizes as size}
							<label
								class="flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-semibold transition-colors {usualSize === size
									? 'border-brand-500 bg-brand-500 text-white'
									: 'border-line bg-white hover:border-brand-500'}"
							>
								<input type="radio" name="usual-size" value={size} bind:group={usualSize} class="sr-only" />
								{size}
							</label>
						{/each}
					</div>
				</fieldset>

				<fieldset class="mt-6">
					<legend class="text-sm font-bold">3. How do you like your shoes to fit?</legend>
					<div class="mt-2 flex flex-col gap-2 sm:flex-row">
						{#each [['snug', 'Snug', 'Close, locked-in feel'], ['regular', 'Regular', 'True to size'], ['roomy', 'Roomy', 'Extra toe space']] as [value, label, desc]}
							<label
								class="flex h-12 flex-1 cursor-pointer items-center gap-3 rounded-2xl border px-4 transition-colors {fit === value
									? 'border-brand-500 bg-brand-50'
									: 'border-line bg-white hover:border-brand-500'}"
							>
								<input type="radio" name="fit" {value} bind:group={fit} class="h-5 w-5 accent-[#ff6b1a]" />
								<span class="text-sm"><strong>{label}</strong> <span class="text-ink-soft">— {desc}</span></span>
							</label>
						{/each}
					</div>
				</fieldset>

				<button type="submit" class="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-600 sm:w-auto">
					Find my size
				</button>
			</form>
		</Reveal>

		<Reveal delay={80}>
			<div class="rounded-3xl bg-ink p-6 text-white shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">Your recommendation</h2>
				{#if result}
					<p class="mt-3 text-5xl font-extrabold text-brand-400">{result}</p>
					<p class="mt-3 text-[15px] leading-relaxed text-white/75">{note}</p>
					<a href="/shop" class="mt-5 inline-flex h-12 items-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-400">
						Shop in {result}
					</a>
				{:else}
					<p class="mt-3 text-[15px] leading-relaxed text-white/75">
						Answer the three questions and your recommended UK size will appear here.
					</p>
					{#if note}
						<p class="mt-3 rounded-2xl bg-white/10 px-4 py-3 text-sm">{note}</p>
					{/if}
				{/if}
				<p class="mt-5 border-t border-white/10 pt-4 text-[13px] leading-relaxed text-white/50">
					A guide, not a guarantee. Sizing varies by brand and model — check the product page fit note, and see
					the <a class="font-semibold text-white/80 underline" href="/size-guide">size guide</a> for the full
					conversion table.
				</p>
			</div>
		</Reveal>
	</div>
</section>
