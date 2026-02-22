<script lang="ts">
    let {
        className = "",
        id = "",
        label = "",
        value = $bindable(),
        options = [],
        disabled = false,
    } = $props();

    const normalizedOptions = $derived(
        options.map((option) =>
            typeof option === "string"
                ? { value: option, label: option }
                : option,
        ),
    );
</script>

<div class={className}>
    {#if label}
        <label class="text-xs text-stone-400 mb-2 block" for={id}>
            {label}
        </label>
    {/if}
    <select
        {id}
        bind:value
        class="border w-full pl-2 h-9 rounded-md text-stone-300 border-stone-700 focus:outline-none disabled:bg-stone-400/50"
        {disabled}
    >
        {#each normalizedOptions as option}
            <option value={option.value}>{option.label}</option>
        {/each}
    </select>
</div>
