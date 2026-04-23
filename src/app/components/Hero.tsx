import { Badge } from "./ui/badge";
import { Calendar, Eye } from "lucide-react";

const FALLBACK_COLORS = [
  "#93C5FD", "#86EFAC", "#C4B5FD", "#FDE68A",
  "#FCA5A5", "#7DD3FC", "#BBF7D0", "#FED7AA",
  "#FBCFE8", "#A5B4FC",
];

interface HeroProps {
  articles: any[];
  onArticleClick: (article: any) => void;
}

export function Hero({ articles, onArticleClick }: HeroProps) {
  // Find the most popular article (most views)
  const mostPopular = articles.length > 0 
    ? articles.reduce((prev, current) => 
        (current.views || 0) > (prev.views || 0) ? current : prev
      )
    : null;

  if (!mostPopular) {
    return (
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden p-12 text-center">
        <h2 className="mb-4 text-slate-900">No articles yet</h2>
        <p className="text-slate-600">Create your first article in the admin panel</p>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onArticleClick(mostPopular)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <Badge className="w-fit mb-4" variant="secondary">
            Most Popular
          </Badge>
          <h2 className="mb-4 text-slate-900">
            {mostPopular.title}
          </h2>
          <p className="text-slate-600 mb-6">
            {mostPopular.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{mostPopular.date}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="whitespace-nowrap">{mostPopular.readTime}</span>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Eye className="w-4 h-4 flex-shrink-0" />
              <span>{mostPopular.views?.toLocaleString() || 0} views</span>
            </div>
          </div>
        </div>
        <div
          className="h-64 md:h-auto"
          style={{ background: FALLBACK_COLORS[mostPopular.id % FALLBACK_COLORS.length] }}
        >
          {mostPopular.image ? (
            <img
              src={mostPopular.image}
              alt={mostPopular.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                if (target.parentElement)
                  target.parentElement.style.background = FALLBACK_COLORS[mostPopular.id % FALLBACK_COLORS.length];
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}