import { pgTable, serial, text, timestamp, index } from "drizzle-orm/pg-core";

export const comments = pgTable(
  "comments",
  {
    id: serial().primaryKey(),
    postId: text("post_id").notNull(),
    name: text().notNull(),
    body: text().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("comments_post_id_idx").on(t.postId, t.createdAt)]
);
