import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    index,
    integer,
} from "drizzle-orm/pg-core";

export const estimate = pgTable("estimate", {
    uuid: uuid("uuid").defaultRandom().primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const scope = pgTable(
    "scope",
    {
        uuid: uuid("uuid").defaultRandom().primaryKey(),
        title: varchar("title", { length: 128 }).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
        estimateUuid: uuid("estimate_uuid")
            .references(() => estimate.uuid, { onDelete: "cascade" })
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
            .references(() => scope.uuid, { onDelete: "cascade" })
            .notNull(),
    },
    (table) => [index("scope_idx").on(table.scopeUuid)],
);
