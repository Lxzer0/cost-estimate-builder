<script lang="ts">
    let {
        className = "",
        id = "",
        label = "",
        value = $bindable(),
        options = [],
        disabled = false,
    } = $props();
</script>

<div class={className}>
    <label class="text-xs text-stone-400" for={id}>{label}</label>
    <select
        {id}
        bind:value
        class="border w-full pl-2 h-9 my-2 rounded-md text-stone-300 border-stone-700 focus:outline-none disabled:bg-stone-400/50"
        {disabled}
    >
        {#each options as option}
            <option value={option}>{option}</option>
        {/each}
    </select>
</div>
