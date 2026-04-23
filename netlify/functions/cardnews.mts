import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...headers, "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH", "Access-Control-Allow-Headers": "Content-Type" } });
  }

  try {
    const store = getStore("cardnews");

    if (req.method === "GET") {
      const data = await store.get("list", { type: "text" });
      return new Response(data || "[]", { headers });
    }

    if (req.method === "POST") {
      const card = await req.json();
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      const newList = [card, ...list];
      await store.set("list", JSON.stringify(newList));
      return new Response(JSON.stringify(card), { headers });
    }

    if (req.method === "PUT") {
      const card = await req.json();
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      const newList = list.map((c: any) => c.id === card.id ? card : c);
      await store.set("list", JSON.stringify(newList));
      return new Response(JSON.stringify(card), { headers });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      const newList = list.filter((c: any) => String(c.id) !== String(id));
      await store.set("list", JSON.stringify(newList));
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (req.method === "PATCH") {
      const body = await req.json();
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      if (body.ids) {
        // bulk delete
        const newList = list.filter((c: any) => !body.ids.includes(c.id));
        await store.set("list", JSON.stringify(newList));
      } else if (body.id && body.views !== undefined) {
        // increment views
        const newList = list.map((c: any) => c.id === body.id ? { ...c, views: body.views } : c);
        await store.set("list", JSON.stringify(newList));
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
