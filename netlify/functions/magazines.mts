import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...headers, "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH", "Access-Control-Allow-Headers": "Content-Type" } });
  }

  try {
    const store = getStore("magazines");

    if (req.method === "GET") {
      const data = await store.get("list", { type: "text" });
      return new Response(data || "[]", { headers });
    }

    if (req.method === "POST") {
      const magazine = await req.json();
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      const newList = [magazine, ...list];
      await store.set("list", JSON.stringify(newList));
      return new Response(JSON.stringify(magazine), { headers });
    }

    if (req.method === "PUT") {
      const magazine = await req.json();
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      const newList = list.map((m: any) => m.id === magazine.id ? magazine : m);
      await store.set("list", JSON.stringify(newList));
      return new Response(JSON.stringify(magazine), { headers });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      const newList = list.filter((m: any) => String(m.id) !== String(id));
      await store.set("list", JSON.stringify(newList));
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (req.method === "PATCH") {
      const body = await req.json();
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      if (body.ids) {
        // bulk delete
        const newList = list.filter((m: any) => !body.ids.includes(m.id));
        await store.set("list", JSON.stringify(newList));
      } else if (body.id && body.views !== undefined) {
        // increment views
        const newList = list.map((m: any) => m.id === body.id ? { ...m, views: body.views } : m);
        await store.set("list", JSON.stringify(newList));
      }
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Magazines API error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers });
  }
};

export const config: Config = {
  path: "/api/magazines"
};
