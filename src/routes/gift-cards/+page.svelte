<script lang="ts">
	import { Check, Copy, Gift } from 'phosphor-svelte';
	import { giftcards, type GiftCard } from '#lib/store.svelte';

	const AMOUNTS = [25, 50, 100, 150];

	let amount = $state(50);
	let customAmount = $state('');
	let recipientName = $state('');
	let recipientEmail = $state('');
	let message = $state('');
	let error = $state('');
	let newCard = $state<GiftCard | null>(null);
	let copied = $state('');

	function chooseAmount(a: number) {
		amount = a;
		customAmount = '';
		error = '';
	}

	function effectiveAmount(): number | null {
		if (customAmount.trim()) {
			const n = Number(customAmount);
			if (!Number.isFinite(n) || n < 10 || n > 500) return null;
			return Math.floor(n);
		}
		return amount;
	}

	function purchase(e: SubmitEvent) {
		e.preventDefault();
		const value = effectiveAmount();
		if (value === null) {
			error = 'Choose an amount between $10 and $500.';
			return;
		}
		error = '';
		newCard = giftcards.add(value);
	}

	async function copyCode(code: string) {
		try {
			await navigator.clipboard.writeText(code);
		} catch {
			// Clipboard API unavailable (older browser / permission) — the code
			// is still shown on screen and selectable.
		}
		copied = code;
		setTimeout(() => (copied = ''), 2500);
	}

	function fmtDate(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Gift Cards — Shoemate</title>
	<meta name="description" content="Send a Shoemate e-gift card — demo only, no payment is taken and codes work in this browser until the backend arrives." />
</svelte:head>

<section class="pt-8">
	<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Gift cards</h1>
	<p class="mt-1 max-w-xl text-[15px] text-ink-soft">
		Give sneakers. The lucky one gets a code to redeem at checkout.
	</p>
	<p class="mt-2 inline-flex items-center gap-2 rounded-full bg-peach px-4 py-2 text-[13px] font-semibold text-brand-700">
		<Gift size={16} weight="bold" /> Demo only — no payment is taken and no email is sent.
	</p>

	<div class="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
		<form onsubmit={purchase} class="min-w-0 rounded-3xl bg-white p-5 shadow-card sm:p-6">
			<h2 class="text-lg font-extrabold">Choose an amount</h2>
			<div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Gift card amount">
				{#each AMOUNTS as a (a)}
					<button
						type="button"
						onclick={() => chooseAmount(a)}
						aria-pressed={amount === a && !customAmount.trim()}
						class="flex h-12 items-center justify-center rounded-full border text-base font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 {amount === a && !customAmount.trim()
							? 'border-ink bg-ink text-white'
							: 'border-line bg-white hover:border-ink'}"
					>
						${a}
					</button>
				{/each}
			</div>
			<div class="mt-3">
				<label for="gift-custom" class="text-sm font-semibold">Or a custom amount ($10–$500)</label>
				<input
					id="gift-custom"
					type="text"
					inputmode="numeric"
					bind:value={customAmount}
					placeholder="e.g. 75"
					class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25"
				/>
			</div>

			<h2 class="mt-7 text-lg font-extrabold">Who's it for? <span class="text-sm font-medium text-ink-soft">(optional)</span></h2>
			<div class="mt-3 grid gap-4 sm:grid-cols-2">
				<div>
					<label for="gift-name" class="text-sm font-semibold">Recipient name</label>
					<input id="gift-name" type="text" bind:value={recipientName} placeholder="Alex Carter" autocomplete="off" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
				</div>
				<div>
					<label for="gift-email" class="text-sm font-semibold">Recipient email</label>
					<input id="gift-email" type="email" bind:value={recipientEmail} placeholder="friend@example.com" autocomplete="off" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
				</div>
				<div class="sm:col-span-2">
					<label for="gift-message" class="text-sm font-semibold">Message <span class="font-medium text-ink-soft">(optional)</span></label>
					<textarea id="gift-message" bind:value={message} rows="3" placeholder="Happy birthday — go pick something fast." class="mt-1.5 w-full resize-none rounded-2xl border border-line px-4 py-3 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25"></textarea>
				</div>
			</div>

			{#if error}
				<p class="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</p>
			{/if}
			<button type="submit" class="mt-5 flex h-12 items-center justify-center gap-2 rounded-full bg-brand-500 px-7 text-sm font-semibold text-white hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
				<Gift size={18} weight="bold" /> Get gift card · ${effectiveAmount() ?? '—'}
			</button>
			<p class="mt-3 text-[13px] leading-relaxed text-ink-soft">
				Demo purchase: your card is generated instantly and stored in this browser. Nothing is charged and nothing is emailed — share the code yourself.
			</p>
		</form>

		<aside class="min-w-0 space-y-6">
			{#if newCard}
				{@const card = newCard}
				<div class="rounded-3xl bg-ink p-5 text-white shadow-card sm:p-6" role="status">
					<p class="flex items-center gap-2 text-sm font-semibold text-emerald-300">
						<Check size={18} weight="bold" /> Your gift card is ready
					</p>
					<p class="mt-3 text-3xl font-extrabold">${card.amount}</p>
					{#if recipientName}<p class="mt-1 text-sm text-white/70">For {recipientName}</p>{/if}
					<div class="mt-4 flex items-center justify-between gap-2 rounded-2xl bg-white/10 px-4 py-3">
						<code class="font-mono text-sm font-bold tracking-wide break-all">{card.code}</code>
						<button type="button" onclick={() => copyCode(card.code)} class="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-ink hover:bg-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Copy gift card code">
							{#if copied === card.code}<Check size={16} weight="bold" /> Copied{:else}<Copy size={16} /> Copy{/if}
						</button>
					</div>
					<p class="mt-3 text-[13px] leading-relaxed text-white/70">
						Redeemable at checkout in this browser. Real gift-card delivery arrives with the Go backend.
					</p>
				</div>
			{/if}

			<div class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
				<h2 class="text-lg font-extrabold">Your gift cards</h2>
				{#if giftcards.list().length}
					<ul class="mt-4 space-y-3">
						{#each giftcards.list() as card (card.code)}
							<li class="flex items-center justify-between gap-3 rounded-2xl bg-mist px-4 py-3">
								<div class="min-w-0">
									<code class="block truncate font-mono text-sm font-bold">{card.code}</code>
									<span class="text-[13px] text-ink-soft">{fmtDate(card.date)} · Balance ${card.balance} of ${card.amount}</span>
								</div>
								<button type="button" onclick={() => copyCode(card.code)} class="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 text-sm font-semibold shadow-sm hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500" aria-label="Copy code {card.code}">
									{#if copied === card.code}<Check size={16} weight="bold" /> Copied{:else}<Copy size={16} /> Copy{/if}
								</button>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-2 text-sm text-ink-soft">No gift cards yet in this browser.</p>
				{/if}
			</div>

			<div class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
				<h2 class="text-lg font-extrabold">How it works</h2>
				<ol class="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
					<li>Pick an amount and get a code instantly.</li>
					<li>Share the code with whoever you're gifting.</li>
					<li>They enter it at checkout — the balance comes off the total.</li>
				</ol>
				<p class="mt-3 text-[13px] text-ink-soft">Demo codes only work in this browser, until the backend tracks them properly.</p>
			</div>
		</aside>
	</div>
</section>
