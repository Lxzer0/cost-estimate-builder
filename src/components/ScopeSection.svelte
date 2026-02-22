<script lang="ts">
    import {
        calculateItemTotal,
        calculateScopeTotal,
        formatCurrency,
        capitalize,
        type Scope,
    } from "../utils/totals";
    import type {
        SupportedLocale,
        CurrencyCode,
        Translations,
    } from "../utils/i18n";

    export let scope: Scope;
    export let scopeIndex: number;
    export let locale: SupportedLocale;
    export let currency: CurrencyCode;
    export let t: Translations;
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
            {t.removeScope}
        </button>
    </div>

    {#if scope.items.length === 0}
        <div class="mt-2 text-xs text-stone-500">{t.noItems}</div>
    {:else}
        <div class="mt-4 rounded-md border border-stone-800">
            <table class="w-full text-sm text-stone-300">
                <thead
                    class="bg-stone-900/70 text-xs uppercase tracking-wide text-stone-400"
                >
                    <tr class="border-b border-stone-800">
                        <th class="px-3 py-2 w-1/2 text-left">{t.title}</th>
                        <th class="px-3 py-2 text-right">{t.amount}</th>
                        <th class="px-3 py-2 text-left">{t.unit}</th>
                        <th class="px-3 py-2 text-left">{t.cost}</th>
                        <th class="px-3 py-2 text-left">{t.total}</th>
                        <th class="px-3 py-2 text-right">{t.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each scope.items as item, itemIndex (itemIndex)}
                        <tr class="border-b border-stone-800 last:border-0">
                            <td class="px-3 py-2 w-1/2">
                                {item.title || t.untitledItem}
                            </td>
                            <td class="px-3 text-right">{item.amount}</td>
                            <td class="px-3">{item.unit || "-"}</td>
                            <td class="px-3">
                                {formatCurrency(item.cost, locale, currency)}
                            </td>
                            <td class="px-3">
                                {formatCurrency(
                                    calculateItemTotal(item),
                                    locale,
                                    currency,
                                )}
                            </td>
                            <td class="px-3 text-right">
                                <button
                                    type="button"
                                    on:click={() =>
                                        onRemoveItem(scopeIndex, itemIndex)}
                                    class="text-xs text-stone-400 hover:text-stone-200"
                                >
                                    {t.remove}
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <div class="mt-4 flex justify-end gap-2 items-baseline">
            <div class="text-stone-400 text-xs">{t.subtotal}</div>
            <div class="text-stone-300 text-sm">
                {formatCurrency(calculateScopeTotal(scope), locale, currency)}
            </div>
        </div>
    {/if}
</section>
