<script lang="ts">
	import { ArrowLeft, ArrowRight, Check, CreditCard, Lock, ShieldCheck, Truck, User } from 'phosphor-svelte';
	import { cart, buildTimeline } from '#lib/store.svelte';
	import { getProduct } from '#lib/data/products';
	import { toast } from '#lib/toast.svelte';

	// ---- Step state (S-09): Details → Payment → Review, one page at a time.
	type Step = 1 | 2 | 3;
	const STEPS = [
		{ n: 1 as Step, label: 'Details' },
		{ n: 2 as Step, label: 'Payment' },
		{ n: 3 as Step, label: 'Review' }
	];
	let step = $state<Step>(1);
	let maxStep = $state<Step>(1);

	function goToStep(n: Step) {
		if (n <= maxStep) {
			step = n;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	// ---- Form fields
	let email = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let address = $state('');
	let city = $state('');
	let zip = $state('');
	let cardName = $state('');
	let cardNumber = $state('');
	let expiry = $state('');
	let cvc = $state('');
	let delivery = $state<'standard' | 'express'>('standard');

	// ---- Field-level errors (S-12): one message per field, under the field.
	let errors = $state<Record<string, string>>({});

	function mergeErrors(keys: string[], next: Record<string, string>) {
		for (const k of keys) delete errors[k];
		Object.assign(errors, next);
	}

	const DETAIL_KEYS = ['email', 'firstName', 'lastName', 'address', 'city', 'zip'];
	const PAYMENT_KEYS = ['cardName', 'cardNumber', 'expiry', 'cvc'];

	function validateDetails(): boolean {
		const next: Record<string, string> = {};
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.';
		if (!firstName.trim()) next.firstName = 'First name is required.';
		if (!lastName.trim()) next.lastName = 'Last name is required.';
		if (!address.trim()) next.address = 'Street address is required.';
		if (!city.trim()) next.city = 'City is required.';
		if (zip.trim().length < 3) next.zip = 'Enter your ZIP or postcode.';
		mergeErrors(DETAIL_KEYS, next);
		return Object.keys(next).length === 0;
	}

	function validatePayment(): boolean {
		const next: Record<string, string> = {};
		if (!cardName.trim()) next.cardName = 'Name on card is required.';
		const digits = cardNumber.replace(/\D/g, '');
		if (digits.length < 15 || digits.length > 16) next.cardNumber = 'Enter a 15–16 digit card number.';
		const m = expiry.match(/^(\d{2})\/(\d{2})$/);
		if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) next.expiry = 'Use MM/YY, e.g. 12/28.';
		if (!/^\d{3,4}$/.test(cvc)) next.cvc = 'Enter the 3–4 digit CVC.';
		mergeErrors(PAYMENT_KEYS, next);
		return Object.keys(next).length === 0;
	}

	// Card-number / expiry auto-formatting (S-12).
	function formatCardNumber(v: string) {
		return v
			.replace(/\D/g, '')
			.slice(0, 16)
			.replace(/(\d{4})(?=\d)/g, '$1 ');
	}
	function formatExpiry(v: string) {
		const d = v.replace(/\D/g, '').slice(0, 4);
		return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`;
	}

	// ---- Promo + gift cards (S-13)
	let promo = $state('');
	let promoApplied = $state(false);
	let promoMsg = $state<{ kind: 'success' | 'error'; text: string } | null>(null);
	interface GiftCard {
		code: string;
		amount: number;
		balance: number;
	}
	let gift = $state<GiftCard | null>(null);

	function lookupGiftCard(code: string): GiftCard | null {
		try {
			const raw = localStorage.getItem('shoemate:giftcards');
			if (!raw) return null;
			const list = JSON.parse(raw) as GiftCard[];
			if (!Array.isArray(list)) return null;
			return list.find((g) => typeof g?.code === 'string' && g.code.toUpperCase() === code) ?? null;
		} catch {
			return null;
		}
	}

	function applyCode() {
		const code = promo.trim().toUpperCase();
		if (!code) {
			promoMsg = { kind: 'error', text: 'Enter a code first.' };
			return;
		}
		if (code === 'SHOEMATE10') {
			promoApplied = true;
			promoMsg = { kind: 'success', text: 'Code applied — 10% off.' };
			toast.success('Promo code SHOEMATE10 applied — 10% off');
			return;
		}
		if (/^SHOE-GIFT-[A-Z0-9]{6}$/.test(code)) {
			const card = lookupGiftCard(code);
			if (card && card.balance > 0) {
				gift = { code: card.code, amount: card.amount, balance: card.balance };
				promoMsg = { kind: 'success', text: `Gift card applied — $${card.balance} available.` };
				toast.success(`Gift card applied — $${card.balance} available`);
			} else {
				promoMsg = { kind: 'error', text: "That code isn't valid" };
				toast.error("That code isn't valid");
			}
			return;
		}
		promoMsg = { kind: 'error', text: "That code isn't valid" };
		toast.error("That code isn't valid");
	}

	function removeGift() {
		gift = null;
		promoMsg = null;
	}

	// ---- Totals (S-11): standard $9 / free over $150, express $19 flat.
	let discount = $derived(promoApplied ? Math.round(cart.subtotal * 0.1) : 0);
	let shipping = $derived(
		cart.subtotal === 0 ? 0 : delivery === 'express' ? 19 : cart.subtotal - discount >= 150 ? 0 : 9
	);
	let giftAmount = $derived(gift ? Math.min(gift.balance, cart.subtotal - discount + shipping) : 0);
	let total = $derived(Math.max(0, cart.subtotal - discount - giftAmount + shipping));

	let orderNo = $state<string | null>(null);
	let placing = $state(false);

	// ---- B2 contract (a): record the demo order in the account store when
	// it exists. Guarded — the build must not break if `orders` is absent.
	async function recordOrder(order: unknown) {
		try {
			const store = await import('#lib/store.svelte');
			const maybeOrders = (store as unknown as { orders?: { add?: unknown } }).orders;
			if (maybeOrders && typeof maybeOrders.add === 'function') {
				(maybeOrders.add as (o: unknown) => void).call(maybeOrders, order);
			}
		} catch {
			// Orders store not present yet — the demo order still confirms.
		}
	}

	function deductGift(amount: number) {
		if (!gift || amount <= 0) return;
		try {
			const raw = localStorage.getItem('shoemate:giftcards');
			if (!raw) return;
			const list = JSON.parse(raw) as GiftCard[];
			const entry = list.find((g) => g.code.toUpperCase() === gift!.code.toUpperCase());
			if (entry) {
				entry.balance = Math.max(0, entry.balance - amount);
				localStorage.setItem('shoemate:giftcards', JSON.stringify(list));
			}
		} catch {
			// Gift-card bookkeeping is best-effort in the demo.
		}
	}

	// ---- B2 contract (b): pre-fill shipping from a saved default address
	// when the account store exposes one. Guarded the same way.
	let addressPrefilled = false;
	$effect(() => {
		if (addressPrefilled) return;
		addressPrefilled = true;
		void (async () => {
			try {
				const store = await import('#lib/store.svelte');
				const addrs = (store as unknown as { addresses?: unknown }).addresses as {
					find?: (fn: (a: Record<string, string>) => boolean) => Record<string, string> | undefined;
					getDefault?: () => Record<string, string> | undefined;
					list?: Record<string, string>[];
					default?: Record<string, string>;
					[Symbol.iterator]?: () => Iterator<Record<string, string>>;
				} | null;
				if (!addrs) return;
				let def: Record<string, string> | undefined;
				if (Array.isArray(addrs)) def = addrs.find((a) => a.isDefault === 'true' || (a as unknown as { isDefault?: boolean }).isDefault) ?? addrs[0];
				else if (typeof addrs.getDefault === 'function') def = addrs.getDefault();
				else if (Array.isArray(addrs.list)) def = addrs.list.find((a) => a.isDefault) ?? addrs.list[0];
				else if (addrs.default) def = addrs.default;
				if (!def) return;
				// Address stores a single `name` (no firstName/lastName) — split
				// it at prefill time so the first/last fields actually fill.
				if (def.name && (!firstName || !lastName)) {
					const parts = def.name.trim().split(/\s+/).filter(Boolean);
					if (!firstName && parts.length) firstName = parts[0];
					if (!lastName && parts.length > 1) lastName = parts.slice(1).join(' ');
				}
				if (!address && (def.address || def.street)) address = def.address ?? def.street ?? '';
				if (!city && def.city) city = def.city;
				if (!zip && (def.zip || def.postalCode)) zip = def.zip ?? def.postalCode ?? '';
			} catch {
				// No addresses API yet — form stays blank.
			}
		})();
	});

	function placeOrder(e: SubmitEvent) {
		e.preventDefault();
		if (step === 1) {
			if (!validateDetails()) return;
			maxStep = 2;
			step = 2;
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return;
		}
		if (step === 2) {
			if (!validatePayment()) return;
			maxStep = 3;
			step = 3;
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return;
		}
		// Step 3 — Review: re-validate everything, then place the order.
		if (!validateDetails() || !validatePayment()) {
			step = !validateDetails() ? 1 : 2;
			return;
		}
		placing = true;
		const now = new Date().toISOString();
		const order = {
			id: `SM-${Date.now().toString(36).toUpperCase()}`,
			date: now,
			items: cart.lines.map((line) => {
				const p = getProduct(line.slug);
				return {
					slug: line.slug,
					name: p?.name ?? line.slug,
					price: p?.price ?? 0,
					qty: line.qty,
					size: line.size,
					// Colour NAME, never a hex: the line carries the name chosen
					// on the PDP; fall back to the product's first colour name.
					colour: line.color ?? p?.colours?.[0]?.name ?? ''
				};
			}),
			subtotal: cart.subtotal,
			shipping,
			discount: discount + giftAmount,
			total,
			status: 'Confirmed',
			// Canonical timeline from the store — same labels ("Confirmed",
			// "Packed", "Shipped", "Delivered") as order detail + /track.
			timeline: buildTimeline(now, 'Confirmed')
		};
		setTimeout(() => {
			void recordOrder(order);
			deductGift(giftAmount);
			orderNo = order.id;
			cart.clear();
			placing = false;
		}, 900);
	}

	const inputCls =
		'mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25';
	const inputErrCls = 'border-red-500 focus:border-red-500 focus:ring-red-500/25';
	const labelCls = 'text-sm font-semibold';
	const errCls = 'mt-1 text-[13px] font-medium text-red-600';
	const cardLast4 = $derived(cardNumber.replace(/\D/g, '').slice(-4));
</script>

<svelte:head>
	<title>Checkout — Shoemate</title>
</svelte:head>

<section class="pt-8">
	{#if orderNo}
		<div class="mx-auto max-w-lg rounded-[2rem] bg-white px-6 py-12 text-center shadow-card sm:px-10">
			<span class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
				<Check size={38} weight="bold" />
			</span>
			<h1 class="mt-5 text-3xl font-extrabold">Order confirmed!</h1>
			<p class="mt-2 text-[15px] text-ink-soft">
				Thanks for shopping with Shoemate. Your order <strong class="text-ink">{orderNo}</strong> is being packed — a confirmation email is on its way to {email}.
			</p>
			<p class="mt-3 text-sm text-ink-soft">
				Estimated delivery: {delivery === 'express' ? '1–2' : '2–4'} business days.
				<a href="/track?id={orderNo}" class="font-semibold text-brand-600 underline underline-offset-2">Track your order</a>
				<span aria-hidden="true"> · </span>
				<a href="/account/orders?id={orderNo}" class="font-semibold text-brand-600 underline underline-offset-2">View in My orders</a>
			</p>
			<p class="mt-4 rounded-2xl bg-mist px-4 py-3 text-sm text-ink-soft">
				You checked out as a guest — no account needed. Want order updates in one place?
				<a href="/signin" class="font-semibold text-brand-600 underline underline-offset-2">Create an account</a>
				after your order (demo).
			</p>
			<a href="/shop" class="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-white hover:bg-brand-500">
				Continue shopping <ArrowRight size={17} weight="bold" />
			</a>
		</div>
	{:else if cart.lines.length === 0}
		<div class="mx-auto max-w-lg rounded-[2rem] bg-white px-6 py-12 text-center shadow-card">
			<h1 class="text-2xl font-extrabold">Nothing to check out yet</h1>
			<p class="mt-2 text-[15px] text-ink-soft">Your cart is empty. Add a pair first.</p>
			<a href="/shop" class="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-brand-500 px-7 text-sm font-semibold text-white hover:bg-brand-600">
				Shop sneakers <ArrowRight size={17} weight="bold" />
			</a>
		</div>
	{:else}
		<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Checkout</h1>
		<p class="mt-2 flex items-start gap-1.5 text-sm font-medium text-ink">
			<User size={16} class="mt-0.5 shrink-0 text-brand-500" />
			Checkout as guest — no account needed. You can create an account after your order.
		</p>
		<p class="mt-1 flex items-start gap-1.5 text-sm text-ink-soft">
			<Lock size={15} class="mt-0.5 shrink-0 text-brand-500" /> Demo checkout — no real payment is taken and no card is charged.
		</p>

		<!-- Progress indicator (S-09): Details → Payment → Review. Completed
		     steps are buttons back; the current step is aria-current. -->
		<nav aria-label="Checkout progress" class="mt-6">
			<ol class="flex items-start">
				{#each STEPS as s, i}
					<li class="flex min-w-0 flex-1 items-start {i > 0 ? '' : ''}">
						{#if i > 0}
							<span class="mt-5 h-0.5 min-w-3 flex-1 {s.n <= maxStep ? 'bg-brand-500' : 'bg-line'}" aria-hidden="true"></span>
						{/if}
						{#if s.n <= maxStep && s.n !== step}
							<button
								type="button"
								onclick={() => goToStep(s.n)}
								class="group flex w-20 shrink-0 flex-col items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
								aria-label="Go back to {s.label}"
							>
								<span class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white group-hover:bg-brand-600">
									<Check size={18} weight="bold" />
								</span>
								<span class="text-xs font-semibold">{s.label}</span>
							</button>
						{:else}
							<span class="flex w-20 shrink-0 flex-col items-center gap-1.5" aria-current={s.n === step ? 'step' : undefined}>
								<span class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold {s.n === step ? 'bg-ink text-white' : 'bg-mist text-ink-soft'}">
									{s.n}
								</span>
								<span class="text-xs font-semibold {s.n === step ? 'text-ink' : 'text-ink-soft'}">{s.label}</span>
							</span>
						{/if}
						{#if i < STEPS.length - 1}
							<span class="mt-5 h-0.5 min-w-3 flex-1 {s.n < maxStep ? 'bg-brand-500' : 'bg-line'}" aria-hidden="true"></span>
						{/if}
					</li>
				{/each}
			</ol>
		</nav>

		<form class="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]" onsubmit={placeOrder} novalidate>
			<div class="min-w-0 space-y-6">
				{#if step === 1}
					<fieldset class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
						<legend class="px-2 text-lg font-extrabold">Contact</legend>
						<div>
							<label for="co-email" class={labelCls}>Email</label>
							<input id="co-email" type="email" inputmode="email" bind:value={email} placeholder="you@example.com" autocomplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'co-email-err' : undefined} class="{inputCls} {errors.email ? inputErrCls : ''}" />
							{#if errors.email}<p id="co-email-err" class={errCls} role="alert">{errors.email}</p>{/if}
						</div>
					</fieldset>

					<fieldset class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
						<legend class="px-2 text-lg font-extrabold">Shipping address</legend>
						<div class="grid gap-4 sm:grid-cols-2">
							<div>
								<label for="co-first" class={labelCls}>First name</label>
								<input id="co-first" type="text" bind:value={firstName} autocomplete="given-name" aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? 'co-first-err' : undefined} class="{inputCls} {errors.firstName ? inputErrCls : ''}" />
								{#if errors.firstName}<p id="co-first-err" class={errCls} role="alert">{errors.firstName}</p>{/if}
							</div>
							<div>
								<label for="co-last" class={labelCls}>Last name</label>
								<input id="co-last" type="text" bind:value={lastName} autocomplete="family-name" aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? 'co-last-err' : undefined} class="{inputCls} {errors.lastName ? inputErrCls : ''}" />
								{#if errors.lastName}<p id="co-last-err" class={errCls} role="alert">{errors.lastName}</p>{/if}
							</div>
							<div class="sm:col-span-2">
								<label for="co-address" class={labelCls}>Street address</label>
								<input id="co-address" type="text" bind:value={address} autocomplete="street-address" aria-invalid={!!errors.address} aria-describedby={errors.address ? 'co-address-err' : undefined} class="{inputCls} {errors.address ? inputErrCls : ''}" />
								{#if errors.address}<p id="co-address-err" class={errCls} role="alert">{errors.address}</p>{/if}
							</div>
							<div>
								<label for="co-city" class={labelCls}>City</label>
								<input id="co-city" type="text" bind:value={city} autocomplete="address-level2" aria-invalid={!!errors.city} aria-describedby={errors.city ? 'co-city-err' : undefined} class="{inputCls} {errors.city ? inputErrCls : ''}" />
								{#if errors.city}<p id="co-city-err" class={errCls} role="alert">{errors.city}</p>{/if}
							</div>
							<div>
								<label for="co-zip" class={labelCls}>ZIP / Postcode</label>
								<input id="co-zip" type="text" inputmode="text" bind:value={zip} autocomplete="postal-code" aria-invalid={!!errors.zip} aria-describedby={errors.zip ? 'co-zip-err' : undefined} class="{inputCls} {errors.zip ? inputErrCls : ''}" />
								{#if errors.zip}<p id="co-zip-err" class={errCls} role="alert">{errors.zip}</p>{/if}
							</div>
						</div>
					</fieldset>
				{:else if step === 2}
					<!-- Delivery method (S-11) -->
					<fieldset class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
						<legend class="px-2 text-lg font-extrabold">Delivery method</legend>
						<div class="space-y-3">
							<label class="flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors {delivery === 'standard' ? 'border-brand-500 bg-brand-50' : 'border-line hover:border-ink-soft'}">
								<input type="radio" name="delivery" value="standard" bind:group={delivery} class="mt-1 h-5 w-5 shrink-0 accent-[#ff6b1a]" />
								<span class="min-w-0 flex-1">
									<span class="flex flex-wrap items-baseline justify-between gap-2">
										<span class="text-[15px] font-bold">Standard delivery</span>
										<span class="text-sm font-bold">{cart.subtotal - discount >= 150 ? 'Free' : '$9'}</span>
									</span>
									<span class="mt-0.5 block text-sm text-ink-soft">2–4 business days · free over $150</span>
								</span>
							</label>
							<label class="flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors {delivery === 'express' ? 'border-brand-500 bg-brand-50' : 'border-line hover:border-ink-soft'}">
								<input type="radio" name="delivery" value="express" bind:group={delivery} class="mt-1 h-5 w-5 shrink-0 accent-[#ff6b1a]" />
								<span class="min-w-0 flex-1">
									<span class="flex flex-wrap items-baseline justify-between gap-2">
										<span class="flex items-center gap-1.5 text-[15px] font-bold"><Truck size={17} class="text-brand-500" /> Express delivery</span>
										<span class="text-sm font-bold">$19</span>
									</span>
									<span class="mt-0.5 block text-sm text-ink-soft">1–2 business days · priority handling</span>
								</span>
							</label>
						</div>
					</fieldset>

					<fieldset class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
						<legend class="px-2 text-lg font-extrabold">Payment</legend>
						<p class="flex items-center gap-2 text-sm text-ink-soft"><CreditCard size={18} class="text-brand-500" /> Card details are never stored in this demo.</p>
						<div class="mt-4 grid gap-4 sm:grid-cols-2">
							<div class="sm:col-span-2">
								<label for="co-cardname" class={labelCls}>Name on card</label>
								<input id="co-cardname" type="text" bind:value={cardName} autocomplete="cc-name" aria-invalid={!!errors.cardName} aria-describedby={errors.cardName ? 'co-cardname-err' : undefined} class="{inputCls} {errors.cardName ? inputErrCls : ''}" />
								{#if errors.cardName}<p id="co-cardname-err" class={errCls} role="alert">{errors.cardName}</p>{/if}
							</div>
							<div class="sm:col-span-2">
								<label for="co-cardnum" class={labelCls}>Card number</label>
								<input id="co-cardnum" type="text" inputmode="numeric" bind:value={cardNumber} oninput={(e) => (cardNumber = formatCardNumber(e.currentTarget.value))} placeholder="4242 4242 4242 4242" autocomplete="cc-number" aria-invalid={!!errors.cardNumber} aria-describedby={errors.cardNumber ? 'co-cardnum-err' : undefined} class="{inputCls} font-mono {errors.cardNumber ? inputErrCls : ''}" />
								{#if errors.cardNumber}<p id="co-cardnum-err" class={errCls} role="alert">{errors.cardNumber}</p>{/if}
							</div>
							<div>
								<label for="co-expiry" class={labelCls}>Expiry (MM/YY)</label>
								<input id="co-expiry" type="text" inputmode="numeric" bind:value={expiry} oninput={(e) => (expiry = formatExpiry(e.currentTarget.value))} placeholder="12/28" autocomplete="cc-exp" aria-invalid={!!errors.expiry} aria-describedby={errors.expiry ? 'co-expiry-err' : undefined} class="{inputCls} font-mono {errors.expiry ? inputErrCls : ''}" />
								{#if errors.expiry}<p id="co-expiry-err" class={errCls} role="alert">{errors.expiry}</p>{/if}
							</div>
							<div>
								<label for="co-cvc" class={labelCls}>CVC</label>
								<input id="co-cvc" type="text" inputmode="numeric" bind:value={cvc} oninput={(e) => (cvc = e.currentTarget.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" autocomplete="cc-csc" aria-invalid={!!errors.cvc} aria-describedby={errors.cvc ? 'co-cvc-err' : undefined} class="{inputCls} font-mono {errors.cvc ? inputErrCls : ''}" />
								{#if errors.cvc}<p id="co-cvc-err" class={errCls} role="alert">{errors.cvc}</p>{/if}
							</div>
						</div>
					</fieldset>
					<button type="button" onclick={() => goToStep(1)} class="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink-soft transition-colors hover:bg-mist focus-visible:ring-2 focus-visible:ring-brand-500">
						<ArrowLeft size={16} /> Back to details
					</button>
				{:else}
					<!-- Review (S-09): same totals as the summary — no new fees. -->
					<div class="space-y-6">
						<section class="rounded-3xl bg-white p-5 shadow-card sm:p-6" aria-labelledby="review-contact">
							<div class="flex items-baseline justify-between gap-3">
								<h2 id="review-contact" class="text-lg font-extrabold">Contact &amp; shipping</h2>
								<button type="button" onclick={() => goToStep(1)} class="text-sm font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-500">Edit</button>
							</div>
							<dl class="mt-3 space-y-1.5 text-sm">
								<div class="flex gap-2"><dt class="w-24 shrink-0 text-ink-soft">Email</dt><dd class="font-medium break-all">{email}</dd></div>
								<div class="flex gap-2"><dt class="w-24 shrink-0 text-ink-soft">Name</dt><dd class="font-medium">{firstName} {lastName}</dd></div>
								<div class="flex gap-2"><dt class="w-24 shrink-0 text-ink-soft">Address</dt><dd class="font-medium">{address}, {city} {zip}</dd></div>
							</dl>
						</section>
						<section class="rounded-3xl bg-white p-5 shadow-card sm:p-6" aria-labelledby="review-delivery">
							<div class="flex items-baseline justify-between gap-3">
								<h2 id="review-delivery" class="text-lg font-extrabold">Delivery</h2>
								<button type="button" onclick={() => goToStep(2)} class="text-sm font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-500">Edit</button>
							</div>
							<p class="mt-3 text-sm">
								<span class="font-semibold">{delivery === 'express' ? 'Express delivery' : 'Standard delivery'}</span>
								<span class="text-ink-soft"> — {delivery === 'express' ? '1–2 business days' : '2–4 business days'} · {shipping === 0 ? 'Free' : `$${shipping}`}</span>
							</p>
						</section>
						<section class="rounded-3xl bg-white p-5 shadow-card sm:p-6" aria-labelledby="review-payment">
							<div class="flex items-baseline justify-between gap-3">
								<h2 id="review-payment" class="text-lg font-extrabold">Payment</h2>
								<button type="button" onclick={() => goToStep(2)} class="text-sm font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-500">Edit</button>
							</div>
							<p class="mt-3 text-sm">
								<span class="font-semibold">{cardName}</span>
								<span class="text-ink-soft"> · Card ending in {cardLast4 || '••••'}</span>
							</p>
							<p class="mt-1 text-xs text-ink-soft">Demo checkout — no real payment is taken.</p>
						</section>
					</div>
				{/if}
			</div>

			<aside class="h-fit min-w-0 rounded-3xl bg-white p-5 shadow-card sm:p-6 lg:sticky lg:top-24">
				<h2 class="text-lg font-extrabold">Order summary</h2>
				<ul class="mt-4 space-y-3">
					{#each cart.lines as line (line.slug + line.size)}
						{@const p = getProduct(line.slug)}
						{#if p}
							<li class="flex items-center gap-3 text-sm">
								<img src={p.image} alt="" class="h-12 w-12 shrink-0 rounded-xl bg-mist object-cover" width="96" height="96" />
								<span class="min-w-0 flex-1">
									<span class="block truncate font-semibold">{p.name}</span>
									<span class="text-xs text-ink-soft">{line.size} × {line.qty}</span>
								</span>
								<span class="shrink-0 font-bold">${p.price * line.qty}</span>
							</li>
						{/if}
					{/each}
				</ul>
				<div class="mt-4 flex gap-2">
					<label class="sr-only" for="co-promo">Promo or gift card code</label>
					<input id="co-promo" type="text" bind:value={promo} placeholder="SHOEMATE10 or SHOE-GIFT-…" autocapitalize="characters" class="h-11 min-w-0 flex-1 rounded-full border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
					<button type="button" onclick={applyCode} class="h-11 shrink-0 rounded-full bg-ink px-4 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">Apply</button>
				</div>
				{#if promoMsg}
					<p class="mt-2 text-[13px] font-semibold {promoMsg.kind === 'success' ? 'text-emerald-700' : 'text-red-600'}" role="status">{promoMsg.text}</p>
				{/if}
				{#if gift}
					<p class="mt-2 flex items-center justify-between text-[13px] font-semibold text-emerald-700">
						<span>Gift card {gift.code} — ${gift.balance} available</span>
						<button type="button" onclick={removeGift} class="rounded-full px-2 py-1 text-xs font-bold text-red-600 underline underline-offset-2">Remove</button>
					</p>
				{/if}
				<dl class="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
					<div class="flex justify-between"><dt class="text-ink-soft">Subtotal</dt><dd class="font-semibold">${cart.subtotal}</dd></div>
					{#if discount}
						<div class="flex justify-between text-emerald-700"><dt>Discount (SHOEMATE10)</dt><dd class="font-semibold">−${discount}</dd></div>
					{/if}
					{#if giftAmount}
						<div class="flex justify-between text-emerald-700"><dt>Gift card</dt><dd class="font-semibold">−${giftAmount}</dd></div>
					{/if}
					<div class="flex justify-between"><dt class="text-ink-soft">Shipping ({delivery === 'express' ? 'Express' : 'Standard'})</dt><dd class="font-semibold">{shipping === 0 ? 'Free' : `$${shipping}`}</dd></div>
					<div class="flex justify-between border-t border-line pt-3 text-base"><dt class="font-bold">Total</dt><dd class="font-extrabold">${total}</dd></div>
				</dl>
				<button type="submit" disabled={placing} class="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60">
					{placing ? 'Placing order…' : step === 1 ? 'Continue to payment' : step === 2 ? 'Continue to review' : `Place order · $${total}`}
				</button>
				<p class="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
					<ShieldCheck size={15} class="text-brand-500" /> 30-day returns · Authenticity guaranteed
				</p>
			</aside>
		</form>
	{/if}
</section>
