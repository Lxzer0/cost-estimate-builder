import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
  foreignKey,
} from "drizzle-orm/pg-core";

export const scopes = pgTable("scopes", {
  uuid: uuid("uuid").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export const items = pgTable(
  "items",
  {
    uuid: uuid("uuid").defaultRandom().primaryKey(),
    scopeUuid: uuid("scope_uuid").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount").notNull(),
    cost: numeric("cost").notNull(),
    unit: text("unit").notNull(),
    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull(),
  },
  (table) => [({
    scopeFk: foreignKey({
      columns: [table.scopeUuid],
      foreignColumns: [scopes.uuid],
      name: "items_scope_uuid_scopes_uuid_fk",
    }),
  })]
);
