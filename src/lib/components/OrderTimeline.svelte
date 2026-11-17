<script lang="ts">
	import { Check } from 'phosphor-svelte';
	import type { TimelineStep } from '#lib/store.svelte';

	let { steps }: { steps: TimelineStep[] } = $props();

	function fmt(iso: string): string {
		if (!iso) return '';
		return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<!-- Demo tracking timeline: Confirmed → Packed → Shipped → Delivered.
     Steps not yet done show their estimated date, never a fake event. -->
<ol class="space-y-0">
	{#each steps as step, i (step.label)}
		<li class="relative flex gap-4 pb-6 last:pb-0">
			{#if i < steps.length - 1}
				<span
					class="absolute top-8 left-[15px] h-[calc(100%-2rem)] w-0.5 {step.done ? 'bg-emerald-500' : 'bg-line'}"
					aria-hidden="true"
				></span>
			{/if}
			<span
				class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full {step.done
					? 'bg-emerald-500 text-white'
					: 'border-2 border-line bg-white text-ink-soft'}"
				aria-hidden="true"
			>
				{#if step.done}<Check size={16} weight="bold" />{:else}<span class="h-2 w-2 rounded-full bg-line"></span>{/if}
			</span>
			<div class="min-w-0 pt-1">
				<p class="text-[15px] font-bold {step.done ? '' : 'text-ink-soft'}">{step.label}</p>
				<p class="text-sm text-ink-soft">
					{#if step.done}
						{fmt(step.date)}
					{:else if step.date}
						Estimated {fmt(step.date)}
					{:else}
						Pending
					{/if}
				</p>
			</div>
		</li>
	{/each}
</ol>
