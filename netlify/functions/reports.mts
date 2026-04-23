import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...headers, "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,PATCH", "Access-Control-Allow-Headers": "Content-Type" } });
  }

  try {
    const store = getStore("reports");

    if (req.method === "GET") {
      const data = await store.get("list", { type: "text" });
      return new Response(data || "[]", { headers });
    }

    if (req.method === "POST") {
      const report = await req.json();
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      const newList = [report, ...list];
      await store.set("list", JSON.stringify(newList));
      return new Response(JSON.stringify(report), { headers });
    }

    if (req.method === "PUT") {
      const report = await req.json();
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      const newList = list.map((r: any) => r.id === report.id ? report : r);
      await store.set("list", JSON.stringify(newList));
      return new Response(JSON.stringify(report), { headers });
    }

    if (req.method === "DELETE") {
      const url = new URL(req.url);
      const id = url.searchParams.get("id");
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      const newList = list.filter((r: any) => String(r.id) !== String(id));
      await store.set("list", JSON.stringify(newList));
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (req.method === "PATCH") {
      const body = await req.json();
      const listText = await store.get("list", { type: "text" });
      const list = listText ? JSON.parse(listText) : [];
      if (body.ids) {
        // bulk delete
        const newList = list.filter((r: any) => !body.ids.includes(r.id));
        await store.set("list", JSON.stringify(newList));
      } else if (body.id && body.views !== undefined) {
        // increment views
        const newList = list.map((r: any) => r.id === body.id ? { ...r, views: body.views } : r);
        await store.set("list", JSON.stringify(newList));
      }
      return new Response(JSON.stringify({ success: true }), { headers });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Reports API error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers });
  }
};

export const config: Config = {
  path: "/api/reports"
};
