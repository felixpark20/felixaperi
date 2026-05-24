interface CardNews {
  id: number;
  images: string[];
  title: string;
  date: string;
  pdfUrl?: string;
  pdfName?: string;
  views?: number;
}

interface CardNewsGridProps {
  cardNews: CardNews[];
  onCardClick: (card: CardNews) => void;
}

export function CardNewsGrid({ cardNews, onCardClick }: CardNewsGridProps) {
  if (cardNews.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="mb-2 text-slate-900 dark:text-slate-100">No card news yet</h3>
        <p className="text-slate-600 dark:text-slate-300">Card news will appear here once uploaded</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cardNews.map((card) => (
        <div
          key={card.id}
          onClick={() => onCardClick(card)}
          className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 dark:bg-slate-800"
        >
          <div className="aspect-square bg-slate-100 overflow-hidden relative dark:bg-slate-700">
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
                PDF
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-slate-900 mb-2 line-clamp-2 dark:text-slate-100">{card.title}</h3>
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>{card.date}</span>
              {card.views !== undefined && (
                <span>{card.views.toLocaleString()} views</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
