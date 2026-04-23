import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...headers, "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH", "Access-Control-Allow-Headers": "Content-Type" } });
  }

  try {
    const store = getStore("articles");

    if (req.method === "GET") {
      const data = await store.get("list", { type: "text" });
      return new Response(data || "[]", { headers });
    }

    if (req.method === "POST") {
      const article = await req.json();
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      const newList = [article, ...list];
      await store.set("list", JSON.stringify(newList));
      return new Response(JSON.stringify(article), { headers });
    }

    if (req.method === "PUT") {
      const article = await req.json();
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      const newList = list.map((a: any) => a.id === article.id ? article : a);
      await store.set("list", JSON.stringify(newList));
      return new Response(JSON.stringify(article), { headers });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      const newList = list.filter((a: any) => String(a.id) !== String(id));
      await store.set("list", JSON.stringify(newList));
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (req.method === "PATCH") {
      const body = await req.json();
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      if (body.ids) {
        // bulk delete
        const newList = list.filter((a: any) => !body.ids.includes(a.id));
        await store.set("list", JSON.stringify(newList));
      } else if (body.id && body.views !== undefined) {
        // increment views
        const newList = list.map((a: any) => a.id === body.id ? { ...a, views: body.views } : a);
        await store.set("list", JSON.stringify(newList));
      }
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Articles API error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers });
  }
};

export const config: Config = {
  path: "/api/articles"
};
