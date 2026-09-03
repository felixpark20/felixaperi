import { useState, useEffect } from "react";
import { Calendar, Eye } from "lucide-react";

// Same palette as CardNewsGrid — keeps placeholders consistent across the site
const PASTEL_COLORS = [
  "#FFD6D6", "#FFE8CC", "#FFF3CC", "#D6F5D6",
  "#CCF0FF", "#D6CCFF", "#FFD6F5", "#D6EAF8",
];

interface CardNews {
  id: number;
  images: string[];
  thumbnail?: string;
  title: string;
  date: string;
  pdfUrl?: string;
  pdfName?: string;
  views?: number;
}

interface TodayCardNewsProps {
  cardNews: CardNews[];
  onCardClick: (card: CardNews) => void;
}

// Parse the date from a card's title (e.g. "April 22nd, 2026" → Date)
// Falls back to card.date field, then id
const parseCardSortKey = (card: CardNews): number => {
  if (card.title) {
    const cleaned = card.title.replace(/(\d+)(st|nd|rd|th)/, "$1");
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  if (card.date) {
    const d = new Date(card.date);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return card.id;
};

export function TodayCardNews({ cardNews, onCardClick }: TodayCardNewsProps) {
  // Show the single most recent card news by the date in its title
  const latestCard = [...cardNews].sort((a, b) => parseCardSortKey(b) - parseCardSortKey(a))[0];

  // The list endpoint returns slim cards (no images), so fetch just the
  // cover image for this one card. `?thumb=1` returns the first image only —
  // never the full multi-MB card payload.
  const [thumb, setThumb] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);

  const localSrc = latestCard?.thumbnail || (latestCard?.images || [])[0];

  useEffect(() => {
    setThumb(null);
    setPageCount((latestCard?.images || []).length);
    if (!latestCard || localSrc) return;

    let cancelled = false;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);

    fetch(`/api/cardnews-detail/${latestCard.id}?thumb=1`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return;
        if (d.thumbnail) setThumb(d.thumbnail);
        if (typeof d.pages === "number") setPageCount(d.pages);
      })
      .catch(() => { /* placeholder stays */ })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [latestCard?.id, localSrc]);

  if (!latestCard) return null;

  const imageSrc = localSrc || thumb;
  const pastelColor = PASTEL_COLORS[latestCard.id % PASTEL_COLORS.length];

  return (
    <section className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-slate-900 mb-1 dark:text-slate-100" style={{ fontSize: "1.1rem" }}>Daily Card News</h2>
        <p className="text-slate-500 text-sm dark:text-slate-400">Latest visual brief</p>
      </div>

      <div
        onClick={() => onCardClick(latestCard)}
        className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex-1 flex flex-col dark:bg-slate-800"
      >
        <div
          className="aspect-square overflow-hidden relative"
          style={{ backgroundColor: pastelColor }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={latestCard.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            // No image yet (still loading, or the fetch failed) — show the
            // title on a pastel tile instead of a broken image icon
            <div className="w-full h-full flex items-end p-4">
              <span className="text-slate-700 font-medium line-clamp-3">{latestCard.title}</span>
            </div>
          )}
          {pageCount > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {pageCount} pages
            </div>
          )}
          {(latestCard.pdfUrl || latestCard.pdfName) && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              PDF
            </div>
          )}
        </div>
        <div className="p-4 flex-1">
          <h3 className="text-slate-900 mb-2 font-semibold dark:text-slate-100">{latestCard.title}</h3>
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{latestCard.date}</span>
            </div>
            {latestCard.views !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{latestCard.views.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
