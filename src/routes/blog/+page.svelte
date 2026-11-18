<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList, collectionPage } from '#lib/jsonld';
	import Reveal from '#lib/components/Reveal.svelte';
	import { blogPosts } from '#lib/data/content';
	import { responsiveImage } from '#lib/images';

	function fmt(date: string) {
		return new Date(date + 'T12:00:00').toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<Seo
		title="The Run Down — Shoemate Blog"
		description="The Run Down: practical guides on sneaker care, fit and culture from Shoemate."
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Blog' }])} />
<JsonLd
		data={collectionPage(
			'The Run Down',
			'/blog/',
			blogPosts.map((p) => ({ name: p.title, href: `/blog/${p.slug}/` }))
		)}
	/>

<section class="pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">The Run Down</p>
		<h1 class="mt-1 max-w-2xl text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
			Guides, care &amp; culture
		</h1>
		<p class="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
			Practical sneaker writing — how to clean them, how they should fit, and how to keep them looking new.
			No hype, just what works.
		</p>
	</Reveal>

	<div class="mt-8 grid gap-4 md:grid-cols-3">
		{#each blogPosts as post, i}
			<Reveal delay={i * 70}>
				<a href="/blog/{post.slug}" class="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-shadow hover:shadow-lift">
					<img src={responsiveImage(post.image).src} srcset={responsiveImage(post.image).srcset} sizes="(max-width: 767px) 100vw, 400px" alt={post.imageAlt} loading="lazy" width="1600" height="1600" class="aspect-[4/3] w-full object-cover" />
					<div class="flex flex-1 flex-col p-5">
						<p class="text-xs font-semibold text-ink-soft">{fmt(post.date)} · {post.readMinutes} min read</p>
						<h2 class="mt-2 font-bold group-hover:text-brand-600">{post.title}</h2>
						<p class="mt-1 flex-1 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>
						<span class="mt-3 text-sm font-semibold text-brand-600">Read the guide →</span>
					</div>
				</a>
			</Reveal>
		{/each}
	</div>
</section>
