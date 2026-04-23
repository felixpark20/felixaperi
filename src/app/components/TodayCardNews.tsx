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

export function TodayCardNews({ cardNews, onCardClick }: TodayCardNewsProps) {
  // Get today's date in the same format as card.date (e.g., "Nov 17, 2025")
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Show today's card news first; fall back to latest 3 if none today
  const todayCards = cardNews.filter(card => card.date === today);
  const displayCards = todayCards.length > 0
    ? todayCards
    : [...cardNews].sort((a, b) => b.id - a.id).slice(0, 3);
  const isToday = todayCards.length > 0;

  if (displayCards.length === 0) {
    return null;
  }

  return (
    <section className="h-full">
      <div className="mb-6">
        <h2 className="text-slate-900 mb-2">{isToday ? "Today's Card News" : "Latest Card News"}</h2>
        <p className="text-slate-600">{isToday ? "Latest visual insights from today" : "Most recent visual insights"}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayCards.map((card) => (
          <div
            key={card.id}
            onClick={() => onCardClick(card)}
            className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="aspect-square bg-slate-100 overflow-hidden relative">
              <img
                src={(card.images || [])[0]}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {(card.images || []).length > 0 && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {(card.images || []).length} pages
                </div>
              )}
              {card.pdfUrl && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  PDF Available
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-slate-900 mb-2 line-clamp-2">{card.title}</h3>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Today</span>
                </div>
                {card.views !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{card.views.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
