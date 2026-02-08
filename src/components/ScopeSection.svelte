<script lang="ts">
    import {
        calculateItemTotal,
        calculateScopeTotal,
        formatCurrency,
        capitalize,
        type Scope,
    } from "../utils/totals";

    export let scope: Scope;
    export let scopeIndex: number;
    export let onRemoveSection: (sectionIndex: number) => void;
    export let onRemoveItem: (sectionIndex: number, itemIndex: number) => void;
</script>

<section class="rounded-md border border-stone-800 bg-stone-900/50 p-4">
    <div class="flex items-start justify-between">
        <div class="font-medium text-rose-200">{capitalize(scope.name)}</div>
        <button
            type="button"
            on:click={() => onRemoveSection(scopeIndex)}
            class="text-xs text-stone-400 hover:text-stone-200"
        >
            Remove scope
        </button>
    </div>

    {#if scope.items.length === 0}
        <div class="mt-2 text-xs text-stone-500">No items yet.</div>
    {:else}
        <div class="mt-4 rounded-md border border-stone-800">
            <table class="w-full text-sm text-stone-300">
                <thead
                    class="bg-stone-900/70 text-xs uppercase tracking-wide text-stone-400"
                >
                    <tr class="border-b border-stone-800">
                        <th class="px-3 py-2 w-1/2 text-left">Title</th>
                        <th class="px-3 py-2 text-right">Amount</th>
                        <th class="px-3 py-2 text-left">Unit</th>
                        <th class="px-3 py-2 text-left">Cost</th>
                        <th class="px-3 py-2 text-left">Total</th>
                        <th class="px-3 py-2 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each scope.items as item, itemIndex (itemIndex)}
                        <tr class="border-b border-stone-800 last:border-0">
                            <td class="px-3 py-2 w-1/2">
                                {item.title || "Untitled item"}
                            </td>
                            <td class="px-3 text-right">{item.amount}</td>
                            <td class="px-3">{item.unit || "-"}</td>
                            <td class="px-3">{formatCurrency(item.cost)}</td>
                            <td class="px-3">
                                {formatCurrency(calculateItemTotal(item))}
                            </td>
                            <td class="px-3 text-right">
                                <button
                                    type="button"
                                    on:click={() =>
                                        onRemoveItem(scopeIndex, itemIndex)}
                                    class="text-xs text-stone-400 hover:text-stone-200"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="mt-4 flex justify-end gap-2 items-baseline">
            <div class="text-stone-400 text-xs">Subtotal</div>
            <div class="text-stone-300 text-sm">
                {formatCurrency(calculateScopeTotal(scope))}
            </div>
        </div>
    {/if}
</section>
