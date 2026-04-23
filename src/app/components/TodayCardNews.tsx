import { Calendar, Eye } from "lucide-react";

interface CardNews {
  id: number;
  images: string[];
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

  if (!latestCard) return null;

  return (
    <section className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-slate-900 mb-1" style={{ fontSize: "1.1rem" }}>Daily Card News</h2>
        <p className="text-slate-500 text-sm">Latest visual brief</p>
      </div>

      <div
        onClick={() => onCardClick(latestCard)}
        className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex-1 flex flex-col"
      >
        <div className="aspect-square bg-slate-100 overflow-hidden relative">
          <img
            src={(latestCard.images || [])[0]}
            alt={latestCard.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {(latestCard.images || []).length > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {(latestCard.images || []).length} pages
            </div>
          )}
          {latestCard.pdfUrl && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              PDF
            </div>
          )}
        </div>
        <div className="p-4 flex-1">
          <h3 className="text-slate-900 mb-2 font-semibold">{latestCard.title}</h3>
          <div className="flex items-center justify-between text-sm text-slate-500">
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
