import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

// Helper: build a slim entry from a full card (for list-slim)
const toSlim = (card: any) => ({
  id: card.id,
  title: card.title,
  date: card.date,
  views: card.views ?? 0,
  pdfName: card.pdfName ?? null,
  thumbnail: (card.images || [])[0] ?? null,
});

export default async (req: Request) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...headers, "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH", "Access-Control-Allow-Headers": "Content-Type" } });
  }

  try {
    const store = getStore("cardnews");

    if (req.method === "GET") {
      // Use list-slim (fast, small) if available; otherwise return empty.
      // Run cardnews-migrate first to populate list-slim from legacy data.
      const slim = await store.get("list-slim", { type: "text" });
      return new Response(slim || "[]", { headers });
    }

    if (req.method === "POST") {
      const card = await req.json();
      // Save full card data in its own blob
      await store.set(`card-${card.id}`, JSON.stringify(card));
      // Update slim list
      const slimText = await store.get("list-slim", { type: "text" });
      const slimList = slimText ? JSON.parse(slimText) : [];
      await store.set("list-slim", JSON.stringify([toSlim(card), ...slimList]));
      return new Response(JSON.stringify(card), { headers });
    }

    if (req.method === "PUT") {
      const card = await req.json();
      // Update full card blob
      await store.set(`card-${card.id}`, JSON.stringify(card));
      // Update slim list entry
      const slimText = await store.get("list-slim", { type: "text" });
      const slimList = slimText ? JSON.parse(slimText) : [];
      const newSlim = slimList.map((c: any) => c.id === card.id ? toSlim(card) : c);
      await store.set("list-slim", JSON.stringify(newSlim));
      return new Response(JSON.stringify(card), { headers });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      // Remove individual card blob
      await store.delete(`card-${id}`).catch(() => null);
      // Update slim list
      const slimText = await store.get("list-slim", { type: "text" });
      const slimList = slimText ? JSON.parse(slimText) : [];
      const newSlim = slimList.filter((c: any) => String(c.id) !== String(id));
      await store.set("list-slim", JSON.stringify(newSlim));
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (req.method === "PATCH") {
      const body = await req.json();
      const slimText = await store.get("list-slim", { type: "text" });
      const slimList = slimText ? JSON.parse(slimText) : [];
      if (body.ids) {
        // bulk delete
        for (const id of body.ids) {
          await store.delete(`card-${id}`).catch(() => null);
        }
        const newSlim = slimList.filter((c: any) => !body.ids.includes(c.id));
        await store.set("list-slim", JSON.stringify(newSlim));
      } else if (body.id && body.views !== undefined) {
        // increment views — update slim list + full card blob
        const newSlim = slimList.map((c: any) => c.id === body.id ? { ...c, views: body.views } : c);
        await store.set("list-slim", JSON.stringify(newSlim));
        const fullText = await store.get(`card-${body.id}`, { type: "text" }).catch(() => null);
        if (fullText) {
          const full = JSON.parse(fullText);
          await store.set(`card-${body.id}`, JSON.stringify({ ...full, views: body.views }));
        }
      }
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("CardNews API error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers });
  }
};

export const config: Config = {
  path: "/api/cardnews"
};
