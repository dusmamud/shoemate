<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import { breadcrumbList } from '#lib/jsonld';
	import { Check, MapPin, PencilSimple, Plus, Trash, X } from 'phosphor-svelte';
	import AccountNav from '#lib/components/AccountNav.svelte';
	import { addresses, type Address } from '#lib/store.svelte';

	let editingId = $state<string | null>(null);
	let showForm = $state(false);
	let error = $state('');
	let savedNote = $state('');

	// Form draft (shared for add + edit).
	let label = $state('');
	let name = $state('');
	let street = $state('');
	let city = $state('');
	let zip = $state('');
	let country = $state('');
	let isDefault = $state(false);

	function resetForm() {
		label = '';
		name = '';
		street = '';
		city = '';
		zip = '';
		country = '';
		isDefault = false;
		editingId = null;
		error = '';
	}

	function openAdd() {
		resetForm();
		showForm = true;
	}

	function openEdit(a: Address) {
		label = a.label;
		name = a.name;
		street = a.street;
		city = a.city;
		zip = a.zip;
		country = a.country;
		isDefault = a.isDefault;
		editingId = a.id;
		error = '';
		showForm = true;
	}

	function closeForm() {
		showForm = false;
		resetForm();
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!label.trim() || !name.trim() || !street.trim() || !city.trim() || !zip.trim() || !country.trim()) {
			error = 'Please fill in every field.';
			return;
		}
		const input = {
			label: label.trim(),
			name: name.trim(),
			street: street.trim(),
			city: city.trim(),
			zip: zip.trim(),
			country: country.trim(),
			isDefault
		};
		if (editingId) addresses.update(editingId, input);
		else addresses.add(input);
		savedNote = editingId ? 'Address updated.' : 'Address added.';
		setTimeout(() => (savedNote = ''), 3000);
		closeForm();
	}
</script>

<svelte:head>
	<Seo
		title="Addresses — Shoemate"
		description="Your saved delivery addresses on Shoemate — add, edit and set a default, stored locally in this browser (demo)."
		noindex
	/>
</svelte:head>

<JsonLd data={breadcrumbList([{ name: 'Home', href: '/' }, { name: 'Account', href: '/account/' }, { name: 'Addresses' }])} />

<section class="pt-8">
	<h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Addresses</h1>
	<p class="mt-1 text-[15px] text-ink-soft">Saved in this browser only — checkout can reuse your default address.</p>

	<div class="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
		<AccountNav />

		<div class="min-w-0 space-y-6">
			{#if savedNote}
				<p class="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700" role="status">
					<Check size={18} weight="bold" /> {savedNote}
				</p>
			{/if}

			{#if addresses.list().length}
				<ul class="space-y-4">
					{#each addresses.list() as a (a.id)}
						<li class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<p class="flex flex-wrap items-center gap-2 font-extrabold">
										{a.label}
										{#if a.isDefault}
											<span class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Default</span>
										{/if}
									</p>
									<p class="mt-1 text-sm font-semibold">{a.name}</p>
									<p class="mt-0.5 text-sm text-ink-soft">{a.street}</p>
									<p class="text-sm text-ink-soft">{a.city}, {a.zip} · {a.country}</p>
								</div>
								<span class="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-peach text-brand-500 sm:flex">
									<MapPin size={20} weight="bold" />
								</span>
							</div>
							<div class="mt-4 flex flex-wrap gap-2">
								{#if !a.isDefault}
									<button type="button" onclick={() => addresses.setDefault(a.id)} class="flex h-11 items-center rounded-full bg-mist px-4 text-sm font-semibold hover:bg-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
										Set as default
									</button>
								{/if}
								<button type="button" onclick={() => openEdit(a)} class="flex h-11 items-center gap-1.5 rounded-full bg-mist px-4 text-sm font-semibold hover:bg-peach focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
									<PencilSimple size={16} /> Edit
								</button>
								<button type="button" onclick={() => addresses.remove(a.id)} class="flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink-soft hover:bg-mist hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500" aria-label="Delete address {a.label}">
									<Trash size={16} /> Delete
								</button>
							</div>
						</li>
					{/each}
				</ul>
			{:else if !showForm}
				<div class="flex flex-col items-center rounded-3xl bg-white px-6 py-14 text-center shadow-card">
					<span class="flex h-20 w-20 items-center justify-center rounded-full bg-peach text-brand-500">
						<MapPin size={34} weight="bold" />
					</span>
					<h2 class="mt-4 text-xl font-extrabold">No addresses yet</h2>
					<p class="mt-1 max-w-sm text-sm text-ink-soft">Save your first delivery address — checkout will offer it back to you.</p>
				</div>
			{/if}

			{#if showForm}
				<form onsubmit={submit} class="rounded-3xl bg-white p-5 shadow-card sm:p-6">
					<div class="flex items-start justify-between gap-3">
						<h2 class="text-lg font-extrabold">{editingId ? 'Edit address' : 'Add an address'}</h2>
						<button type="button" onclick={closeForm} class="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500" aria-label="Close address form">
							<X size={19} weight="bold" />
						</button>
					</div>
					<div class="mt-4 grid gap-4 sm:grid-cols-2">
						<div>
							<label for="addr-label" class="text-sm font-semibold">Label</label>
							<input id="addr-label" type="text" bind:value={label} placeholder="Home, Work…" autocomplete="off" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div>
							<label for="addr-name" class="text-sm font-semibold">Full name</label>
							<input id="addr-name" type="text" bind:value={name} placeholder="Alex Carter" autocomplete="name" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div class="sm:col-span-2">
							<label for="addr-street" class="text-sm font-semibold">Street address</label>
							<input id="addr-street" type="text" bind:value={street} placeholder="12 Runner's Lane, Apt 4" autocomplete="street-address" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div>
							<label for="addr-city" class="text-sm font-semibold">City</label>
							<input id="addr-city" type="text" bind:value={city} autocomplete="address-level2" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div>
							<label for="addr-zip" class="text-sm font-semibold">ZIP / Postcode</label>
							<input id="addr-zip" type="text" bind:value={zip} autocomplete="postal-code" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div>
							<label for="addr-country" class="text-sm font-semibold">Country</label>
							<input id="addr-country" type="text" bind:value={country} autocomplete="country-name" class="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-base outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25" />
						</div>
						<div class="flex items-center">
							<label class="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-semibold">
								<input type="checkbox" bind:checked={isDefault} class="h-5 w-5 accent-[#ff6b1a]" />
								Set as default address
							</label>
						</div>
					</div>
					{#if error}
						<p class="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</p>
					{/if}
					<button type="submit" class="mt-5 flex h-12 items-center justify-center rounded-full bg-ink px-7 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
						{editingId ? 'Save changes' : 'Add address'}
					</button>
				</form>
			{:else}
				<button type="button" onclick={openAdd} class="flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
					<Plus size={18} weight="bold" /> Add an address
				</button>
			{/if}
		</div>
	</div>
</section>
