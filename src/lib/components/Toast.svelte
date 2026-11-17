<script lang="ts">
	import { CheckCircle, Info, WarningCircle, X } from 'phosphor-svelte';
	import { toast, type ToastKind } from '#lib/toast.svelte';

	const icons: Record<ToastKind, typeof CheckCircle> = {
		success: CheckCircle,
		info: Info,
		error: WarningCircle
	};

	const styles: Record<ToastKind, string> = {
		success: 'bg-ink text-white',
		info: 'bg-ink text-white',
		error: 'bg-red-700 text-white'
	};
</script>

<!-- Rendered once in +layout.svelte. Fixed above drawers (z-50) so a toast
     is visible even while the cart drawer is open. -->
<div class="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4" aria-live="polite">
	{#each toast.items as item (item.id)}
		{@const Icon = icons[item.kind]}
		<div
			role="status"
			class="animate-toast-in pointer-events-auto flex min-h-11 max-w-md items-center gap-2.5 rounded-full py-2 pr-2 pl-4 text-sm font-medium shadow-2xl {styles[item.kind]}"
		>
			<Icon size={19} weight="fill" class={item.kind === 'error' ? 'text-white' : 'text-emerald-400'} />
			<span class="min-w-0">{item.message}</span>
			<button
				type="button"
				onclick={() => toast.dismiss(item.id)}
				aria-label="Dismiss notification"
				class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
			>
				<X size={15} weight="bold" />
			</button>
		</div>
	{/each}
</div>
