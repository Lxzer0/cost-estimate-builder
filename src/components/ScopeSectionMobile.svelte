<script lang="ts">
    import {
        calculateItemTotal,
        formatCurrency,
        type Scope,
    } from "@/utils/totals";
    import type {
        SupportedLocale,
        CurrencyCode,
        Translations,
    } from "@/utils/i18n";
    import { formatUnitLabel } from "@/utils/i18n";

    export let scope: Scope;
    export let scopeIndex: number;
    export let locale: SupportedLocale;
    export let currency: CurrencyCode;
    export let t: Translations;
    export let onRemoveItem: (sectionIndex: number, itemIndex: number) => void;
</script>

<div class="mt-4 space-y-2 sm:hidden">
    {#each scope.items as item, itemIndex (itemIndex)}
        <section
            class="rounded-md border border-border bg-surface-muted p-3 text-xxs text-text"
        >
            <div class="flex items-start justify-between gap-3">
                <div class="font-medium text-text wrap-anywhere">
                    {item.title || t.untitledItem}
                </div>
                <button
                    type="button"
                    on:click={() => onRemoveItem(scopeIndex, itemIndex)}
                    class="border-x px-1 hover:underline text-text-muted hover:text-text-strong"
                >
                    {t.remove}
                </button>
            </div>

            <div class="flex flex-row justify-between text-xxs mt-2 gap-4">
                <div class="flex gap-3 flex-row">
                    <div class="text-end">
                        <span class="text-text-muted">{t.amount}</span>
                        <span>{item.amount}</span>
                    </div>
                    <div>
                        <span class="text-text-muted">{t.unit}</span>
                        <span>
                            {item.unit
                                ? formatUnitLabel(item.unit, locale)
                                : "-"}
                        </span>
                    </div>
                    <div>
                        <span class="text-text-muted">{t.cost}</span>
                        <span>
                            {formatCurrency(item.cost, locale, currency)}
                        </span>
                    </div>
                </div>
                <div>
                    <span class="text-text-muted">{t.total}</span>
                    <span>
                        {formatCurrency(
                            calculateItemTotal(item),
                            locale,
                            currency,
                        )}
                    </span>
                </div>
            </div>
        </section>
    {/each}
</div>
