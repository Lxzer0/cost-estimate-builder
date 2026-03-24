<script lang="ts">
    import {
        calculateItemTotal,
        calculateScopeTotal,
        formatCurrency,
        capitalize,
        type Scope,
    } from "@/utils/totals";
    import type {
        SupportedLocale,
        CurrencyCode,
        Translations,
    } from "@/utils/i18n";
    import { formatUnitLabel } from "@/utils/i18n";
    import ScopeSectionMobile from "@/components/ScopeSectionMobile.svelte";

    export let scope: Scope;
    export let scopeIndex: number;
    export let locale: SupportedLocale;
    export let currency: CurrencyCode;
    export let t: Translations;
    export let onRemoveSection: (sectionIndex: number) => void;
    export let onRemoveItem: (sectionIndex: number, itemIndex: number) => void;
</script>

<section class="rounded-md border border-border bg-surface p-4">
    <div class="flex items-start justify-between">
        <div class="font-medium text-accent-strong">
            {capitalize(scope.name)}
        </div>
        <button
            type="button"
            on:click={() => onRemoveSection(scopeIndex)}
            class="text-xs text-text-muted hover:text-text-strong border-x px-1 hover:underline"
        >
            {t.removeScope}
        </button>
    </div>

    {#if scope.items.length === 0}
        <div class="mt-2 text-xs text-text-soft">
            {t.noItems}
        </div>
    {:else}
        <ScopeSectionMobile
            {scope}
            {scopeIndex}
            {locale}
            {currency}
            {t}
            {onRemoveItem}
        />

        <div class="mt-4 hidden rounded-md border border-border sm:block">
            <table class="w-full text-sm text-text">
                <thead
                    class="bg-surface-muted text-xs uppercase tracking-wide text-text-muted"
                >
                    <tr class="border-b border-border">
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
                        <tr class="border-b border-border last:border-0">
                            <td class="px-3 py-2 w-1/2 wrap-anywhere">
                                {item.title || t.untitledItem}
                            </td>
                            <td class="px-3 text-right">{item.amount}</td>
                            <td class="px-3">
                                {item.unit
                                    ? formatUnitLabel(item.unit, locale)
                                    : "-"}
                            </td>
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
                                    class="text-xs text-text-muted hover:text-text-strong border-x px-1"
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
            <div class="text-text-muted text-xs">
                {t.subtotal}
            </div>
            <div class="text-text text-sm">
                {formatCurrency(calculateScopeTotal(scope), locale, currency)}
            </div>
        </div>
    {/if}
</section>
