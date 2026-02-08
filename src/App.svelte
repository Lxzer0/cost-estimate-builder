<script lang="ts">
    import defaults from "./assets/defaults.json";
    import {
        calculateGrandTotal,
        formatCurrency,
        capitalize,
        type Scope,
    } from "./utils/totals";
    import { loadScopes, saveScopes } from "./utils/storage";
    import { exportEstimatePdf } from "./utils/pdfExport";

    import Selector from "./components/Selector.svelte";
    import Input from "./components/Input.svelte";
    import ScopeSection from "./components/ScopeSection.svelte";

    type entryType = "Item" | "Scope";

    let estimateTitle = "";
    let titleInput = "";
    let entryType: entryType = "Item";
    let scopeInput = "General";
    let costInput = "";
    let amountInput = "";
    let unitInput = "";
    let unitOptions = ["piece", "set", "unit", "box", "pack", "m²", "m", "l"];

    let scopesValue: Scope[] = loadScopes();
    let scopeOptions: string[] = [];

    $: saveScopes(scopesValue);
    $: scopeOptions = scopesValue
        .map((scope) => scope.name)
        .filter((name) => name.toLowerCase() !== "general");

    const parseNumber = (value: string) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const addEntry = () => {
        const title = titleInput.trim();
        const scopeName = entryType === "Scope" ? title : scopeInput.trim();
        const scopeKey = scopeName.toLowerCase();

        if (!scopeName) return;

        if (entryType === "Scope") {
            const alreadyExists = scopesValue.some(
                (scope) => scope.name.toLowerCase() === scopeKey,
            );
            if (!alreadyExists) {
                scopesValue = [...scopesValue, { name: scopeName, items: [] }];
                titleInput = "";
            }
            return;
        }

        const amount = parseNumber(amountInput);
        const cost = parseNumber(costInput);

        if (!title && !amountInput && !costInput) return;

        const item = { title, amount, cost, unit: unitInput.trim() };
        const scopeIndex = scopesValue.findIndex(
            (scope) => scope.name.toLowerCase() === scopeKey,
        );

        if (scopeIndex === -1) {
            scopesValue = [...scopesValue, { name: scopeName, items: [item] }];
        } else {
            const scope = scopesValue[scopeIndex];
            scopesValue = scopesValue.map((current, index) =>
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
        scopesValue = scopesValue.filter((_, index) => index !== sectionIndex);
    };

    const removeItem = (sectionIndex: number, itemIndex: number) => {
        scopesValue = scopesValue.map((section, index) => {
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

    const handleExport = () => {
        exportEstimatePdf(scopesValue, {
            title: estimateTitle.trim(),
        });
    };

    $: titleSuggestions = defaults.map((item) => capitalize(item.title));
    $: grandTotal = calculateGrandTotal(scopesValue);
    $: disabled = entryType === "Scope";
</script>

<svelte:head>
    <title>Cost Estimate Builder</title>
</svelte:head>

<main class="min-h-screen min-w-screen bg-stone-950">
    <div class="mx-auto flex max-w-3xl flex-col gap-6 p-6">
        <section class="rounded-xl border border-stone-800 bg-stone-900/50 p-4">
            <div class="uppercase text-sm text-rose-400 tracking-wide">
                Title
            </div>
            <Input
                className="mt-2"
                id="estimate-title"
                bind:value={estimateTitle}
                placeholder="Cost Estimate"
            />
        </section>

        <section class="rounded-xl border border-stone-800 bg-stone-900/50 p-4">
            <div class="uppercase text-sm text-rose-400 tracking-wide">
                New entry
            </div>

            <div class="grid gap-2 md:grid-cols-9 my-4">
                <Input
                    className="md:col-span-5"
                    id="item-title"
                    label={entryType}
                    bind:value={titleInput}
                    placeholder={`${entryType} name`}
                    suggestions={titleSuggestions}
                />

                <Selector
                    className="md:col-span-2"
                    id="entry-type"
                    label="Type"
                    bind:value={entryType}
                    options={["Item", "Scope"]}
                />

                <Selector
                    className="md:col-span-2"
                    id="scope-name"
                    label="Scope"
                    bind:value={scopeInput}
                    options={["General", ...scopeOptions]}
                    {disabled}
                />

                <Input
                    className="md:col-span-3"
                    id="cost-input"
                    label="Cost"
                    type="number"
                    bind:value={costInput}
                    placeholder="0"
                    {disabled}
                />

                <Input
                    className="md:col-span-3"
                    id="amount-input"
                    label="Amount"
                    type="number"
                    bind:value={amountInput}
                    placeholder="0"
                    {disabled}
                />

                <Selector
                    className="md:col-span-3"
                    id="unit-input"
                    label="Unit"
                    bind:value={unitInput}
                    options={unitOptions}
                    {disabled}
                />
            </div>

            <button
                on:click={addEntry}
                class="inline-flex items-center justify-center rounded-md border border-stone-700/80 bg-stone-800 px-3 py-1.5 text-sm font-medium text-rose-100 transition
                hover:bg-stone-700/60 focus:outline-none focus:ring-1 focus:ring-rose-400
                disabled:cursor-not-allowed disabled:opacity-60"
            >
                Add
            </button>
        </section>

        <section class="rounded-xl border border-stone-800 bg-stone-900/50 p-4">
            <div class="flex items-start justify-between">
                <div class="uppercase text-sm text-rose-400 tracking-wide">
                    Preview
                </div>
                <button
                    on:click={handleExport}
                    disabled={scopesValue.length === 0}
                    class="inline-flex items-center justify-center rounded-md border border-stone-700/80 bg-stone-800 px-3 py-1.5 text-sm font-medium text-rose-100 transition
                    hover:bg-stone-700/60 focus:outline-none focus:ring-1 focus:ring-rose-400
                    disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Export PDF
                </button>
            </div>

            {#if scopesValue.length === 0}
                <div class="my-4 text-sm text-stone-400">
                    Add items and scopes to build your cost estimate.
                </div>
            {:else}
                <div class="my-4 flex flex-col gap-4">
                    {#each scopesValue as scope, scopeIndex (scopeIndex)}
                        <ScopeSection
                            {scope}
                            {scopeIndex}
                            onRemoveSection={removeSection}
                            onRemoveItem={removeItem}
                        />
                    {/each}
                </div>
                <div class="flex gap-2 justify-end items-baseline">
                    <div class="text-stone-400 text-sm">Grand total</div>
                    <div class="text-stone-300">
                        {formatCurrency(grandTotal)}
                    </div>
                </div>
            {/if}
        </section>
    </div>
</main>
