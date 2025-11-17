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

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  const categoryColors: Record<string, string> = {
    Politics: "bg-blue-100 text-blue-800",
    Stocks: "bg-green-100 text-green-800",
    Economics: "bg-purple-100 text-purple-800"
  };

  return (
    <article onClick={onClick} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div className="h-48 bg-slate-200 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
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
        <div className="flex items-center gap-4 text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{article.date}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{article.readTime}</span>
          </div>
          {article.views !== undefined && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{article.views.toLocaleString()}</span>
              </div>
            </>
          )}
          {article.isExternal && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <ExternalLink className="w-4 h-4" />
                <span>External Link</span>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}