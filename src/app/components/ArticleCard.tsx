import { Badge } from "./ui/badge";
import { Calendar, Clock, Eye, ExternalLink } from "lucide-react";

interface ArticleCardProps {
  article: {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    views?: number;
    isExternal?: boolean;
    externalLink?: string;
  };
  onClick: () => void;
}

const FALLBACK_COLORS = [
  "#93C5FD", "#86EFAC", "#C4B5FD", "#FDE68A",
  "#FCA5A5", "#7DD3FC", "#BBF7D0", "#FED7AA",
  "#FBCFE8", "#A5B4FC",
];

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  const fallbackColor = FALLBACK_COLORS[article.id % FALLBACK_COLORS.length];

  return (
    <article onClick={onClick} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div className="h-48 overflow-hidden" style={{ background: article.image ? undefined : fallbackColor }}>
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              if (target.parentElement) target.parentElement.style.background = fallbackColor;
            }}
          />
        ) : null}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{article.category}</Badge>
          {article.isExternal && (
            <ExternalLink className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <h3 className="mb-2 text-slate-900">
          {article.title}
        </h3>
        <p className="text-slate-600 mb-4 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{article.date}</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{article.readTime}</span>
          </div>
          {article.views !== undefined && (
            <>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Eye className="w-4 h-4 flex-shrink-0" />
                <span>{article.views.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}