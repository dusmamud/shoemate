<script lang="ts">
	import { ArrowLeft, Check, EnvelopeSimple, Key } from 'phosphor-svelte';

	let email = $state('');
	let error = $state('');
	let sent = $state(false);

	function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!email.includes('@')) {
			error = 'Please enter a valid email address.';
			return;
		}
		error = '';
		sent = true;
	}
</script>

<svelte:head>
	<title>Forgot Password — Shoemate</title>
	<meta name="description" content="Reset your Shoemate demo account password — accounts are demo-only and live in this browser." />
</svelte:head>

<section class="mx-auto max-w-md pt-10 sm:pt-16">
	<div class="rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
		<div class="flex flex-col items-center text-center">
			<span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
				<Key size={30} weight="bold" />
			</span>
			<h1 class="mt-4 text-2xl font-extrabold">Forgot your password?</h1>
			<p class="mt-1 text-sm text-ink-soft">Enter the email you signed up with.</p>
		</div>

		{#if sent}
			<div class="mt-6 rounded-2xl bg-emerald-50 px-4 py-4 text-sm leading-relaxed text-emerald-800" role="status">
				<p class="flex items-center gap-2 font-bold"><Check size={18} weight="bold" /> Noted — but read this first</p>
				<p class="mt-2">
					Shoemate accounts are <strong>demo-only</strong> right now: your sign-in lives in this browser's
					local storage, so there is no password on a server to reset and <strong>no reset email is sent</strong>.
				</p>
				<p class="mt-2">
					To start fresh, sign out on the sign-in page and create a new demo account with any password
					you like. Real password resets arrive with the Go backend.
				</p>
			</div>
			<a href="/signin" class="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
				<ArrowLeft size={17} weight="bold" /> Back to sign in
			</a>
		{:else}
			<form class="mt-6 space-y-4" onsubmit={submit}>
				<div>
					<label for="fp-email" class="text-sm font-semibold">Email</label>
					<div class="relative mt-1.5">
						<EnvelopeSimple size={19} class="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-soft" />
						<input
							id="fp-email"
							type="email"
							bind:value={email}
							placeholder="you@example.com"
							autocomplete="email"
							class="h-12 w-full rounded-2xl border border-line pr-4 pl-11 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25"
						/>
					</div>
				</div>
				{#if error}
					<p class="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</p>
				{/if}
				<button type="submit" class="h-12 w-full rounded-full bg-brand-500 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
					Send reset link
				</button>
			</form>
			<p class="mt-4 text-center text-[13px] leading-relaxed text-ink-soft">
				Demo only — no email is actually sent. Support: <span class="font-mono">support@shoemate.example</span>
			</p>
		{/if}
	</div>
</section>
