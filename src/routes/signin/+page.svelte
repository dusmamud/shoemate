<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { Check, Eye, EyeSlash, Sneaker } from 'phosphor-svelte';

	let mode = $state<'signin' | 'signup'>('signin');
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let error = $state('');
	let done = $state(false);

	let storedUser = $state<{ name: string; email: string } | null>(null);
	if (browser) {
		try {
			const raw = localStorage.getItem('shoemate:user');
			if (raw) storedUser = JSON.parse(raw);
		} catch {
			storedUser = null;
		}
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!email.includes('@')) {
			error = 'Please enter a valid email address.';
			return;
		}
		if (password.length < 6) {
			error = 'Password must be at least 6 characters.';
			return;
		}
		if (mode === 'signup' && !name.trim()) {
			error = 'Please enter your name.';
			return;
		}
		error = '';
		const user = { name: mode === 'signup' ? name.trim() : email.split('@')[0], email };
		if (browser) localStorage.setItem('shoemate:user', JSON.stringify(user));
		storedUser = user;
		done = true;
		setTimeout(() => goto('/'), 1600);
	}

	function signOut() {
		if (browser) localStorage.removeItem('shoemate:user');
		storedUser = null;
		done = false;
	}
</script>

<svelte:head>
	<Seo
		title="Sign In — Shoemate"
		description="Sign in to your Shoemate account to check out faster, track orders and manage your wishlist."
		noindex
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Sign In' }])} />

<section class="mx-auto max-w-md pt-10 sm:pt-16">
	<div class="rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
		<div class="flex flex-col items-center text-center">
			<span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
				<Sneaker size={30} weight="fill" />
			</span>
			<h1 class="mt-4 text-2xl font-extrabold">
				{storedUser ? `Welcome back, ${storedUser.name}` : mode === 'signin' ? 'Welcome back' : 'Create your account'}
			</h1>
			<p class="mt-1 text-sm text-ink-soft">
				{storedUser ? 'You are signed in on this device.' : 'Faster checkout, order tracking and members-only drops.'}
			</p>
		</div>

		{#if storedUser}
			<div class="mt-6 rounded-2xl bg-mist p-4 text-sm">
				<p><strong>{storedUser.name}</strong></p>
				<p class="text-ink-soft">{storedUser.email}</p>
			</div>
			{#if done}
				<p class="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
					<Check size={18} weight="bold" /> Signed in — taking you home…
				</p>
			{/if}
			<button type="button" onclick={signOut} class="mt-4 h-12 w-full rounded-full bg-ink text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
				Sign out
			</button>
			<a href="/shop" class="mt-2 flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold text-ink-soft hover:bg-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
				Continue shopping
			</a>
		{:else}
			<div class="mt-6 grid grid-cols-2 rounded-full bg-mist p-1" role="tablist" aria-label="Sign in or create account">
				<button type="button" role="tab" aria-selected={mode === 'signin'} onclick={() => (mode = 'signin')} class="h-11 rounded-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 {mode === 'signin' ? 'bg-ink text-white' : ''}">
					Sign in
				</button>
				<button type="button" role="tab" aria-selected={mode === 'signup'} onclick={() => (mode = 'signup')} class="h-11 rounded-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 {mode === 'signup' ? 'bg-ink text-white' : ''}">
					Create account
				</button>
			</div>

			<form class="mt-6 space-y-4" onsubmit={submit}>
				{#if mode === 'signup'}
					<div>
						<label for="auth-name" class="text-sm font-semibold">Full name</label>
						<input id="auth-name" type="text" bind:value={name} placeholder="Alex Carter" autocomplete="name" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/50" />
					</div>
				{/if}
				<div>
					<label for="auth-email" class="text-sm font-semibold">Email</label>
					<input id="auth-email" type="email" bind:value={email} placeholder="you@example.com" autocomplete="email" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/50" />
				</div>
				<div>
					<label for="auth-password" class="text-sm font-semibold">Password</label>
					<div class="relative mt-1.5">
						<input
							id="auth-password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="At least 6 characters"
							autocomplete={mode === 'signin' ? 'current-password' : 'new-password'}
							class="h-12 w-full rounded-2xl border border-line pr-12 pl-4 text-base outline-none focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/50"
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute top-1/2 right-1 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{#if showPassword}<EyeSlash size={19} />{:else}<Eye size={19} />{/if}
						</button>
					</div>
				</div>
				{#if mode === 'signin'}
					<p class="mt-2 text-right">
						<a href="/forgot-password" class="inline-flex min-h-11 items-center rounded-full px-2 text-[13px] font-semibold text-brand-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
							Forgot password?
						</a>
					</p>
				{/if}
				{#if error}
					<p class="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</p>
				{/if}
				<button type="submit" class="h-12 w-full rounded-full bg-brand-500 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
					{mode === 'signin' ? 'Sign in' : 'Create account'}
				</button>
			</form>

			<p class="mt-4 text-center text-[13px] leading-relaxed text-ink-soft">
				Demo only — no real account is created. Your details stay in this browser until the Go backend arrives.
			</p>
		{/if}
	</div>
</section>
