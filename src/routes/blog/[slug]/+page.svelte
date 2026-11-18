<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import { error } from '@sveltejs/kit';
	import Reveal from '#lib/components/Reveal.svelte';
	import { blogPosts } from '#lib/data/content';
	import { ogSrc, responsiveImage } from '#lib/images';
	import type { PageProps } from './$types';

	let { params }: PageProps = $props();
	const post = blogPosts.find((p) => p.slug === params.slug);
	if (!post) error(404, 'Post not found');

	// BlogPosting: no personal author exists in the data — the Organization
	// is the author. datePublished/dateModified are the post date at UTC
	// midnight (no separate modified date exists in the data).
	const blogJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		image: `https://shoemate.pages.dev${ogSrc(post.image)}`,
		datePublished: `${post.date}T00:00:00Z`,
		dateModified: `${post.date}T00:00:00Z`,
		author: { '@type': 'Organization', name: 'Shoemate', url: 'https://shoemate.pages.dev/' },
		description: post.excerpt
	};

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
		title={`${post.title} — The Run Down · Shoemate`}
		description={post.excerpt}
		ogImage={post.image.replace('/images/', '/images/og-').replace('.png', '.jpg')}
	/>
</svelte:head>

<JsonLd data={blogJsonLd} />
<JsonLd
		data={breadcrumbList([
			{ name: 'Home', href: '/' },
			{ name: 'Blog', href: '/blog/' },
			{ name: post.title }
		])}
	/>

<article class="mx-auto max-w-3xl pt-8">
	<Reveal>
		<p class="text-sm font-semibold tracking-widest text-brand-500 uppercase">The Run Down</p>
		<h1 class="mt-1 text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">{post.title}</h1>
		<p class="mt-3 text-sm text-ink-soft">{fmt(post.date)} · {post.readMinutes} min read</p>
		<img src={responsiveImage(post.image).src} srcset={responsiveImage(post.image).srcset} sizes="(max-width: 767px) 100vw, 768px" alt={post.imageAlt} width="1600" height="1600" class="mt-6 aspect-[16/9] w-full rounded-[2rem] object-cover shadow-card" />
		<p class="mt-6 text-lg leading-relaxed font-medium">{post.excerpt}</p>
	</Reveal>

	{#each post.sections as section}
		<Reveal>
			<h2 class="mt-10 text-2xl font-extrabold">{section.heading}</h2>
			{#each section.paragraphs as para}
				<p class="mt-3 text-[15px] leading-relaxed text-ink-soft">{para}</p>
			{/each}
			{#if section.bullets}
				<ul class="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-ink-soft">
					{#each section.bullets as bullet}
						<li>{bullet}</li>
					{/each}
				</ul>
			{/if}
		</Reveal>
	{/each}

	<Reveal>
		<div class="mt-12 rounded-3xl bg-mist p-6 shadow-card sm:p-7">
			<h2 class="text-lg font-extrabold">Keep reading</h2>
			<div class="mt-3 flex flex-col gap-2">
				{#each blogPosts.filter((p) => p.slug !== post.slug) as other}
					<a href="/blog/{other.slug}" class="flex min-h-11 items-center gap-2 rounded-2xl bg-white px-4 py-2 text-[15px] font-semibold text-brand-600 hover:bg-brand-50">
						{other.title} →
					</a>
				{/each}
			</div>
			<p class="mt-4 text-sm text-ink-soft">
				Not sure of your size? Try the <a class="font-semibold text-brand-600 hover:underline" href="/fit-finder">fit finder</a>
				or the <a class="font-semibold text-brand-600 hover:underline" href="/size-guide">size guide</a>.
			</p>
		</div>
	</Reveal>
</article>
