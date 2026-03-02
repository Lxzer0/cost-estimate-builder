<script lang="ts">
    import suggestions from "@/assets/suggestions.json" with { type: "json" };
    import {
        calculateGrandTotal,
        formatCurrency,
        type Scope,
    } from "@/utils/totals";
    import { loadScopes, saveScopes } from "@/utils/storage";
    import { exportEstimatePdf } from "@/utils/pdfExport";
    import {
        getTranslations,
        getLocaleCurrency,
        getLocaleUnits,
        normalizeUnitKey,
        type UnitKey,
        type SupportedLocale,
    } from "@/utils/i18n";

    import Selector from "@/components/Selector.svelte";
    import Input from "@/components/Input.svelte";
    import ScopeSection from "@/components/ScopeSection.svelte";

    let locale: SupportedLocale = $state("en-US");
    let localeOptions = $state<SupportedLocale[]>([
        "en-US",
        "pl-PL",
        "ru-RU",
        "be-BY",
        "uk-UA",
    ]);

    let t = $derived(getTranslations(locale));
    let currency = $derived(getLocaleCurrency(locale));
    let unitOptions = $derived(getLocaleUnits(locale));
    const normalizeScopesUnits = (storedScopes: Scope[]): Scope[] =>
        storedScopes.map((scope) => ({
            ...scope,
            items: scope.items.map((item) => ({
                ...item,
                unit: normalizeUnitKey(item.unit) || item.unit,
            })),
        }));
    let scopes: Scope[] = $state(normalizeScopesUnits(loadScopes()));
    let scopeOptions: string[] = $state([]);

    let entryType = $state<"item" | "scope">("item");
    let entryTypeLabel = $derived(entryType === "item" ? t.item : t.scope);

    let estimateTitle = $state("");
    let titleInput = $state("");
    let scopeInput = $derived(t.defaultScope);
    let costInput = $state("");
    let amountInput = $state("");
    let unitInput = $state<UnitKey | "">("");

    let grandTotal = $derived(calculateGrandTotal(scopes));
    let disabled = $derived(entryType === "scope");

    type ItemsMap = Record<string, Item>;
    type Item = {
        price?: number;
        unit?: UnitKey | string;
    };

    let suggestionScopes = $derived(suggestions.scopes);
    let suggestionItems = $derived(suggestions.items as ItemsMap);
    let suggestionKeys = $derived(Object.keys(suggestionItems));
    let selectedItem = $derived(suggestionItems[titleInput]);

    $effect(() => {
        if (!selectedItem) {
            costInput = "";
            unitInput = "";
            return;
        }
        costInput = selectedItem?.price?.toString() ?? "";
        unitInput = normalizeUnitKey(selectedItem?.unit);
    });

    $effect(() => saveScopes(scopes));
    $effect(() => {
        scopeOptions = scopes
            .map((scope) => scope.name)
            .filter(
                (name) => name.toLowerCase() !== t.defaultScope.toLowerCase(),
            );
    });

    const parseNumber = (value: string) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const addEntry = () => {
        const title = titleInput.trim();
        const scopeName = entryType === "scope" ? title : scopeInput.trim();
        const scopeKey = scopeName.toLowerCase();

        if (!scopeName) return;

        if (entryType === "scope") {
            const alreadyExists = scopes.some(
                (scope) => scope.name.toLowerCase() === scopeKey,
            );
            if (!alreadyExists) {
                scopes = [...scopes, { name: scopeName, items: [] }];
                titleInput = "";
            }
            return;
        }

        const amount = parseNumber(amountInput);
        const cost = parseNumber(costInput);

        if (!title && !amountInput && !costInput) return;

        const item = { title, amount, cost, unit: unitInput };
        const scopeIndex = scopes.findIndex(
            (scope) => scope.name.toLowerCase() === scopeKey,
        );

        if (scopeIndex === -1) {
            scopes = [...scopes, { name: scopeName, items: [item] }];
        } else {
            const scope = scopes[scopeIndex];
            scopes = scopes.map((current, index) =>
                index === scopeIndex
                    ? { ...scope, items: [...scope.items, item] }
                    : current,
            );
        }

        titleInput = "";
        costInput = "";
        amountInput = "";
        unitInput = "";
    };

    const removeSection = (sectionIndex: number) => {
        scopes = scopes.filter((_, index) => index !== sectionIndex);
    };

    const removeItem = (sectionIndex: number, itemIndex: number) => {
        scopes = scopes.map((section, index) => {
            if (index !== sectionIndex) {
                return section;
            }
            return {
                ...section,
                items: section.items.filter(
                    (_, rowIndex) => rowIndex !== itemIndex,
                ),
            };
        });
    };

    const handleExport = async () => {
        await exportEstimatePdf(scopes, {
            title: estimateTitle.trim(),
            locale,
            currency,
            t,
        });
    };
</script>

<svelte:head>
    <title>Cost Estimate Builder</title>
</svelte:head>

<main class="min-h-screen max-w-screen bg-stone-950">
    <div class="mx-auto flex max-w-3xl flex-col gap-6 p-6">
        <section class="rounded-xl border border-stone-800 bg-stone-900/50 p-4">
            <div class="flex justify-between">
                <div class="uppercase text-sm text-rose-400 tracking-wide">
                    {t.title}
                </div>
                <Selector
                    id="language"
                    bind:value={locale}
                    options={localeOptions}
                />
            </div>
            <Input
                className="mt-2"
                id="estimate-title"
                bind:value={estimateTitle}
                placeholder={t.titlePlaceholder}
            />
        </section>

        <section class="rounded-xl border border-stone-800 bg-stone-900/50 p-4">
            <div class="uppercase text-sm text-rose-400 tracking-wide">
                {t.newEntry}
            </div>

            <div class="grid gap-2 md:grid-cols-9 my-4">
                <Input
                    className="md:col-span-5"
                    id="item-title"
                    label={entryTypeLabel}
                    bind:value={titleInput}
                    placeholder={t.itemNamePlaceholder.replace(
                        "{entryType}",
                        entryTypeLabel,
                    )}
                    suggestions={entryType == "item"
                        ? suggestionKeys
                        : suggestionScopes}
                />

                <Selector
                    className="md:col-span-2"
                    id="entry-type"
                    label={t.type}
                    bind:value={entryType}
                    options={[
                        { value: "item", label: t.item },
                        { value: "scope", label: t.scope },
                    ]}
                />

                <Selector
                    className="md:col-span-2"
                    id="scope-name"
                    label={t.scope}
                    bind:value={scopeInput}
                    options={[t.defaultScope, ...scopeOptions]}
                    {disabled}
                />

                <Input
                    className="md:col-span-3"
                    id="cost-input"
                    label={t.cost}
                    type="number"
                    bind:value={costInput}
                    placeholder="0"
                    {disabled}
                />

                <Input
                    className="md:col-span-3"
                    id="amount-input"
                    label={t.amount}
                    type="number"
                    bind:value={amountInput}
                    placeholder="0"
                    {disabled}
                />

                <Selector
                    className="md:col-span-3"
                    id="unit-input"
                    label={t.unit}
                    bind:value={unitInput}
                    options={unitOptions}
                    {disabled}
                />
            </div>

            <button
                onclick={addEntry}
                class="inline-flex items-center justify-center rounded-md border border-stone-700/80 bg-stone-800 px-3 py-1.5 text-sm font-medium text-rose-100 transition
                hover:bg-stone-700/60 focus:outline-none focus:ring-1 focus:ring-rose-400
                disabled:cursor-not-allowed disabled:opacity-60"
            >
                {t.add}
            </button>
        </section>

        <section class="rounded-xl border border-stone-800 bg-stone-900/50 p-4">
            <div class="flex items-start justify-between">
                <div class="uppercase text-sm text-rose-400 tracking-wide">
                    {t.preview}
                </div>
                <button
                    onclick={handleExport}
                    disabled={scopes.length === 0}
                    class="inline-flex items-center justify-center rounded-md border border-stone-700/80 bg-stone-800 px-3 py-1.5 text-sm font-medium text-rose-100 transition
                    hover:bg-stone-700/60 focus:outline-none focus:ring-1 focus:ring-rose-400
                    disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {t.exportPdf}
                </button>
            </div>

            {#if scopes.length === 0}
                <div class="my-4 text-sm text-stone-400">
                    {t.emptyState}
                </div>
            {:else}
                <div class="my-4 flex flex-col gap-4">
                    {#each scopes as scope, scopeIndex (scopeIndex)}
                        <ScopeSection
                            {scope}
                            {scopeIndex}
                            {locale}
                            {currency}
                            {t}
                            onRemoveSection={removeSection}
                            onRemoveItem={removeItem}
                        />
                    {/each}
                </div>
                <div class="flex gap-2 justify-end items-baseline">
                    <div class="text-stone-400 text-sm">{t.grandTotal}</div>
                    <div class="text-stone-300">
                        {formatCurrency(grandTotal, locale, currency)}
                    </div>
                </div>
            {/if}
        </section>
    </div>
</main>
