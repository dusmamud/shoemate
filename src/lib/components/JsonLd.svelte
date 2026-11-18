<script lang="ts">
	/**
	 * JsonLd — renders any JSON-LD object as a
	 * `<script type="application/ld+json">` block.
	 *
	 * IMPORTANT: this component must be instantiated in the page BODY, never
	 * inside `<svelte:head>`. A `{@html}` script inside a head template breaks
	 * Svelte 5 hydration (the head-template sibling walker runs past the end
	 * of the head node list → `TypeError: Illegal invocation` on mount, and
	 * SvelteKit replaces the page with the 500 error page). A JSON-LD script
	 * in the body is valid HTML and is read identically by Google, the Rich
	 * Results Test and the schema.org validator, which scan the whole
	 * document, not just <head>.
	 *
	 * Used for BreadcrumbList / ItemList / BlogPosting / policy objects.
	 */
	let { data }: { data: Record<string, unknown> } = $props();
</script>

{@html `<script type="application/ld+json">${JSON.stringify(data)}</script>`}
