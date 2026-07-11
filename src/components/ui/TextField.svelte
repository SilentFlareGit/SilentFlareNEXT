<script lang="ts">
let {
	label,
	value = $bindable(""),
	type = "text",
	autocomplete,
	placeholder = "",
	required = false,
	disabled = false,
	maxlength,
}: {
	label: string;
	value?: string;
	type?: "text" | "email" | "password";
	autocomplete?: string;
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	maxlength?: number;
} = $props();
</script>

<label class="sf-field-label">
	<span>{label}</span>
	<input class="sf-field" {type} {autocomplete} {placeholder} {required} {disabled} {maxlength} bind:value />
</label>
