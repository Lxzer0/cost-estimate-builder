CREATE TABLE "items" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scope_uuid" uuid NOT NULL,
	"title" text NOT NULL,
	"amount" numeric NOT NULL,
	"cost" numeric NOT NULL,
	"unit" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scopes" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_scope_uuid_scopes_uuid_fk" FOREIGN KEY ("scope_uuid") REFERENCES "public"."scopes"("uuid") ON DELETE no action ON UPDATE no action;