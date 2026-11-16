<script lang="ts">
	import { page } from '$app/state';
	import { ArrowRight, MagnifyingGlass } from 'phosphor-svelte';
</script>

<section class="mx-auto max-w-2xl pt-20 pb-10 text-center">
	<span class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-peach text-brand-500">
		<MagnifyingGlass size={34} />
	</span>
	<h1 class="mt-5 text-4xl font-extrabold sm:text-5xl">{page.status}</h1>
	<p class="mt-3 text-lg font-semibold">{page.error?.message ?? 'Something went wrong'}</p>
	<p class="mt-2 text-[15px] text-ink-soft">That page does not exist — or it moved. The latest drops are one click away.</p>
	<div class="mt-7 flex flex-wrap items-center justify-center gap-3">
		<a href="/" class="flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-white hover:bg-brand-500">
			Back home <ArrowRight size={17} weight="bold" />
		</a>
		<a href="/shop" class="flex h-12 items-center rounded-full bg-white px-7 text-sm font-semibold shadow-card hover:text-brand-600">
			Shop sneakers
		</a>
	</div>
</section>
