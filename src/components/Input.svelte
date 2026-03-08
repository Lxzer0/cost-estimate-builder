<script lang="ts">
    let {
        className = "",
        id = "",
        label = "",
        type = "text",
        value = $bindable(),
        placeholder = "",
        suggestions = [],
        disabled = false,
        min = "0",
        step = "1",
    } = $props();
</script>

<div class={className}>
    <label class="text-xs text-text-muted mb-2 block" for={id}>
        {label}
    </label>
    <input
        {id}
        {type}
        bind:value
        list={`${id}-suggestions`}
        min={type === "number" ? min : undefined}
        step={type === "number" ? step : undefined}
        {placeholder}
        class="border w-full pl-2 h-9 rounded-md text-text border-border-button disabled:bg-control-disabled-bg focus:outline-none"
        {disabled}
    />
    <datalist id={`${id}-suggestions`}>
        {#each suggestions as suggestion}
            <option value={suggestion}></option>
        {/each}
    </datalist>
</div>
