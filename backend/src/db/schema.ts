import { relations } from "drizzle-orm";
import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    index,
    integer,
} from "drizzle-orm/pg-core";

export const estimates = pgTable("estimates", {
    uuid: uuid("uuid").defaultRandom().primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const scopes = pgTable(
    "scopes",
    {
        uuid: uuid("uuid").defaultRandom().primaryKey(),
        title: varchar("title", { length: 128 }).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
        estimateUuid: uuid("estimate_uuid")
            .references(() => estimates.uuid, { onDelete: "cascade" })
            .notNull(),
    },
    (table) => [index("estimate_idx").on(table.estimateUuid)],
);

export const items = pgTable(
    "items",
    {
        uuid: uuid("uuid").defaultRandom().primaryKey(),
        title: varchar("title", { length: 256 }).notNull(),
        amount: integer("amount").notNull(),
        cost: integer("cost").notNull(),
        unit: varchar("unit", { length: 32 }).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
        scopeUuid: uuid("scope_uuid")
            .references(() => scopes.uuid, { onDelete: "cascade" })
            .notNull(),
    },
    (table) => [index("scope_idx").on(table.scopeUuid)],
);

export const estimateRelations = relations(estimates, ({ many }) => ({
    scopes: many(scopes),
}));

export const scopeRelations = relations(scopes, ({ one, many }) => ({
    estimate: one(estimates, {
        fields: [scopes.estimateUuid],
        references: [estimates.uuid],
    }),
    items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
    scope: one(scopes, {
        fields: [items.scopeUuid],
        references: [scopes.uuid],
    }),
}));
