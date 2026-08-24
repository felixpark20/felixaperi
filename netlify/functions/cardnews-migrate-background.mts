import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

// Background function — runs up to 15 minutes, responds 202 immediately.
// Call once: POST /api/cardnews-migrate
// Reads the monolithic "cardnews/list" blob, splits each card into its own
// "cardnews/card-{id}" blob, and saves a slim list (no inline images/pdf) as
// "cardnews/list-slim" so the regular GET can stay fast.

export default async () => {
  const store = getStore("cardnews");

  try {
    const raw = await store.get("list", { type: "text" });
    if (!raw) {
      console.log("[migrate] No data found in cardnews/list");
      return;
    }

    const list: any[] = JSON.parse(raw);
    console.log(`[migrate] Found ${list.length} cards. Starting migration…`);

    const slimList: any[] = [];

    for (const card of list) {
      // Save full card (images + pdf) in its own blob
      await store.set(`card-${card.id}`, JSON.stringify(card));

      // Slim entry: metadata only — no images or PDF data
      slimList.push({
        id: card.id,
        title: card.title,
        date: card.date,
        views: card.views ?? 0,
        pdfName: card.pdfName ?? null,
      });

      console.log(`[migrate] Saved card ${card.id}`);
    }

    await store.set("list-slim", JSON.stringify(slimList));
    console.log(`[migrate] Done. Saved list-slim with ${slimList.length} entries.`);
  } catch (err) {
    console.error("[migrate] Error:", err);
  }
};

export const config: Config = {
  path: "/api/cardnews-migrate",
};
