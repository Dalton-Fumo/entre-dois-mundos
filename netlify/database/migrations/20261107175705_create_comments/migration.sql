CREATE TABLE "comments" (
	"id" serial PRIMARY KEY,
	"post_id" text NOT NULL,
	"name" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "comments_post_id_idx" ON "comments" ("post_id","created_at");