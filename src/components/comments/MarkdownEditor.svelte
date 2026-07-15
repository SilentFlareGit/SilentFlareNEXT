<script lang="ts">
import Icon from "@iconify/svelte";
import { tick } from "svelte";
import CommentMarkdown from "./CommentMarkdown.svelte";

let {
	value = $bindable(""),
	label = "Comment",
	maxLength = 1000,
}: {
	value?: string;
	label?: string;
	maxLength?: number;
} = $props();

let mode = $state<"write" | "preview">("write");
let textarea: HTMLTextAreaElement;
const remaining = $derived(maxLength - value.length);

async function replaceSelection(
	prefix: string,
	suffix: string,
	placeholder: string,
) {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selected = value.slice(start, end) || placeholder;
	value = `${value.slice(0, start)}${prefix}${selected}${suffix}${value.slice(end)}`;
	await tick();
	textarea.focus();
	textarea.setSelectionRange(
		start + prefix.length,
		start + prefix.length + selected.length,
	);
}

async function insertLinePrefix(prefix: string, placeholder: string) {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selected = value.slice(start, end) || placeholder;
	const insertion = selected
		.split("\n")
		.map((line) => `${prefix}${line}`)
		.join("\n");
	value = `${value.slice(0, start)}${insertion}${value.slice(end)}`;
	await tick();
	textarea.focus();
	textarea.setSelectionRange(start, start + insertion.length);
}
</script>

<div class="overflow-hidden rounded-lg border border-[var(--line-divider)] bg-[var(--card-bg)]">
	<div class="flex min-h-11 flex-wrap items-center justify-between gap-2 border-b border-[var(--line-divider)] px-2 py-1.5">
		<div class="flex rounded-md bg-[var(--btn-regular-bg)] p-0.5" aria-label="Editor mode">
			<button class:!bg-[var(--card-bg)]={mode === "write"} class="min-h-9 rounded px-3 text-sm font-bold text-75" type="button" aria-pressed={mode === "write"} onclick={() => (mode = "write")}>Write</button>
			<button class:!bg-[var(--card-bg)]={mode === "preview"} class="min-h-9 rounded px-3 text-sm font-bold text-75" type="button" aria-pressed={mode === "preview"} onclick={() => (mode = "preview")}>Preview</button>
		</div>

		{#if mode === "write"}
			<div class="flex flex-wrap items-center gap-0.5" aria-label="Markdown formatting">
				<button class="btn-plain h-9 w-9 rounded" type="button" title="Bold" aria-label="Bold" onclick={() => void replaceSelection("**", "**", "bold text")}><Icon icon="material-symbols:format-bold-rounded" class="text-[1.2rem]" /></button>
				<button class="btn-plain h-9 w-9 rounded" type="button" title="Italic" aria-label="Italic" onclick={() => void replaceSelection("_", "_", "italic text")}><Icon icon="material-symbols:format-italic-rounded" class="text-[1.2rem]" /></button>
				<button class="btn-plain h-9 w-9 rounded" type="button" title="Inline code" aria-label="Inline code" onclick={() => void replaceSelection("`", "`", "code")}><Icon icon="material-symbols:code-rounded" class="text-[1.2rem]" /></button>
				<button class="btn-plain h-9 w-9 rounded" type="button" title="Quote" aria-label="Quote" onclick={() => void insertLinePrefix("> ", "quote")}><Icon icon="material-symbols:format-quote-rounded" class="text-[1.2rem]" /></button>
				<button class="btn-plain h-9 w-9 rounded" type="button" title="Bulleted list" aria-label="Bulleted list" onclick={() => void insertLinePrefix("- ", "list item")}><Icon icon="material-symbols:format-list-bulleted-rounded" class="text-[1.2rem]" /></button>
				<button class="btn-plain h-9 w-9 rounded" type="button" title="Link" aria-label="Link" onclick={() => void replaceSelection("[", "](https://)", "link text")}><Icon icon="material-symbols:link-rounded" class="text-[1.2rem]" /></button>
			</div>
		{/if}
	</div>

	{#if mode === "write"}
		<textarea aria-label={label} bind:this={textarea} bind:value class="block min-h-36 w-full resize-y bg-transparent px-4 py-3 leading-7 text-90 outline-none placeholder:text-30" maxlength={maxLength} placeholder="Join the discussion..." required></textarea>
	{:else}
		<div class="min-h-36 px-4 py-3">
			{#if value.trim()}
				<CommentMarkdown content={value} />
			{:else}
				<p class="text-sm text-50">Nothing to preview.</p>
			{/if}
		</div>
	{/if}

	<div class="border-t border-[var(--line-divider)] px-3 py-2 text-right text-xs text-50" class:text-red-500={remaining < 0}>
		{remaining}
	</div>
</div>
