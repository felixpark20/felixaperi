import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

// Returns full card data (images + pdf) for a single card.
// GET /api/cardnews-detail/:id

export default async (req: Request) => {
  const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...headers, "Access-Control-Allow-Methods": "GET", "Access-Control-Allow-Headers": "Content-Type" } });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400, headers });

    const store = getStore("cardnews");
    const data = await store.get(`card-${id}`, { type: "text" });
    if (!data) return new Response(JSON.stringify(null), { headers });

    // ?thumb=1 → cover image only. The homepage uses this so it never has to
    // download the full card (5 images + PDF base64, several MB).
    const url2 = new URL(req.url);
    if (url2.searchParams.get("thumb")) {
      const card = JSON.parse(data);
      const images = Array.isArray(card?.images) ? card.images : [];
      return new Response(JSON.stringify({
        id: card?.id ?? id,
        title: card?.title ?? null,
        date: card?.date ?? null,
        thumbnail: images[0] ?? null,
        pages: images.length,
        pdfName: card?.pdfName ?? null,
      }), { headers });
    }

    return new Response(data, { headers });
  } catch (error) {
    console.error("CardNews detail error:", error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers });
  }
};

export const config: Config = {
  path: "/api/cardnews-detail/:id",
};
