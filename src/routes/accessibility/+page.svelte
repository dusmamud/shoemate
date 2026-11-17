<script lang="ts">
	import Reveal from '#lib/components/Reveal.svelte';
</script>

<svelte:head>
	<title>Accessibility — Shoemate</title>
	<meta
		name="description"
		content="Shoemate accessibility statement: keyboard support, focus states, reduced motion and how to report a barrier."
	/>
</svelte:head>

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">Accessibility</p>
		<h1 class="mt-1 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
			Accessibility statement
		</h1>
		<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
			Everyone should be able to shop for shoes. This page says what we do to make Shoemate accessible — and what
			we still need to fix.
		</p>
	</Reveal>

	<div class="mt-8 space-y-4">
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">What works today</h2>
				<ul class="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-soft">
					<li>A skip link jumps straight to the main content on every page.</li>
					<li>All interactive elements are reachable by keyboard, with a visible focus ring.</li>
					<li>Touch targets are at least 44px, and form inputs use at least 16px text so mobile browsers do not zoom on focus.</li>
					<li>Dialogs (cart drawer, search) can be closed with Escape and label themselves to screen readers.</li>
					<li>Animations are limited to opacity and transform, and are switched off when you prefer reduced motion.</li>
					<li>Images carry descriptive alt text; decorative images are hidden from assistive technology.</li>
				</ul>
			</div>
		</Reveal>
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">Known gaps</h2>
				<ul class="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-soft">
					<li>Focus is not yet trapped inside the cart drawer and search overlay while they are open.</li>
					<li>Some colour contrast on small muted text is below the ideal level and is being reviewed.</li>
					<li>Product images are single-angle renders; there is no text alternative describing each angle yet.</li>
				</ul>
			</div>
		</Reveal>
		<Reveal>
			<div class="rounded-3xl bg-white p-6 shadow-card sm:p-7">
				<h2 class="text-lg font-extrabold">Report a barrier</h2>
				<p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
					If something on this site is hard or impossible to use with your keyboard, screen reader or other
					assistive technology, tell us what happened and which page it was on:
					<a class="font-semibold text-brand-600 hover:underline" href="mailto:support@shoemate.example">support@shoemate.example</a>
					— a placeholder address for this demo storefront; there is no live inbox yet, but reports sent once
					the store launches will be answered.
				</p>
			</div>
		</Reveal>
	</div>
</section>
