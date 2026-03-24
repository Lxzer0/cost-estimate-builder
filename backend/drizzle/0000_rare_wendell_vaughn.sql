CREATE TABLE "estimates" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "items" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"amount" integer NOT NULL,
	"cost" integer NOT NULL,
	"unit" varchar(32) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"scope_uuid" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scopes" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"estimate_uuid" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_scope_uuid_scopes_uuid_fk" FOREIGN KEY ("scope_uuid") REFERENCES "public"."scopes"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scopes" ADD CONSTRAINT "scopes_estimate_uuid_estimates_uuid_fk" FOREIGN KEY ("estimate_uuid") REFERENCES "public"."estimates"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "scope_idx" ON "items" USING btree ("scope_uuid");--> statement-breakpoint
CREATE INDEX "estimate_idx" ON "scopes" USING btree ("estimate_uuid");