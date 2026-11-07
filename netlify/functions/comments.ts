import type { Config } from "@netlify/functions";
import { and, asc, eq, gt, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { comments } from "../../db/schema.js";

const MAX_NAME = 60;
const MAX_BODY = 2000;
const POST_ID_RE = /^[a-z0-9][a-z0-9-_]{0,119}$/i;

const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export default async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const postId = url.searchParams.get("post") || "";
    if (!POST_ID_RE.test(postId)) return json({ error: "invalid_post" }, 400);

    const rows = await db
      .select({ id: comments.id, name: comments.name, body: comments.body, createdAt: comments.createdAt })
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(asc(comments.createdAt))
      .limit(500);
    return json({ comments: rows });
  }

  if (req.method === "POST") {
    let data: Record<string, unknown>;
    try {
      data = await req.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }

    // Honeypot: bots preenchem este campo escondido.
    if (typeof data.website === "string" && data.website.trim() !== "") {
      return json({ ok: true }, 201);
    }

    const postId = String(data.post || "");
    const name = String(data.name || "").trim().replace(/\s+/g, " ");
    const body = String(data.body || "").trim().replace(/\r\n/g, "\n");

    if (!POST_ID_RE.test(postId)) return json({ error: "invalid_post" }, 400);
    if (name.length < 2 || name.length > MAX_NAME) return json({ error: "invalid_name" }, 400);
    if (body.length < 2 || body.length > MAX_BODY) return json({ error: "invalid_body" }, 400);

    // Evita duplicados / flood: mesmo nome e texto no mesmo artigo nos últimos 10 minutos.
    const dup = await db
      .select({ id: comments.id })
      .from(comments)
      .where(
        and(
          eq(comments.postId, postId),
          eq(comments.name, name),
          eq(comments.body, body),
          gt(comments.createdAt, sql`now() - interval '10 minutes'`)
        )
      )
      .limit(1);
    if (dup.length) return json({ error: "duplicate" }, 409);

    const [row] = await db
      .insert(comments)
      .values({ postId, name, body })
      .returning({ id: comments.id, name: comments.name, body: comments.body, createdAt: comments.createdAt });
    return json({ comment: row }, 201);
  }

  return json({ error: "method_not_allowed" }, 405);
};

export const config: Config = {
  path: "/api/comments",
};
