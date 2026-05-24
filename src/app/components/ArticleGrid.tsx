import { ArticleCard } from "./ArticleCard";

interface ArticleGridProps {
  selectedCategory: string;
  onArticleClick: (article: any) => void;
  articles: any[];
}

export function ArticleGrid({ selectedCategory, onArticleClick, articles }: ArticleGridProps) {
  const isAll = !selectedCategory || selectedCategory === "All";
  const filteredArticles = isAll
    ? [...articles].filter(a => !a.isExternal).sort((a: any, b: any) => b.id - a.id).slice(0, 8)
    : articles.filter((article: any) => article.category === selectedCategory);

  return (
    <div>
      <h2 className="mb-6 text-slate-900 dark:text-slate-100">
        {isAll ? "Latest Columns" : `${selectedCategory} Columns`}
      </h2>
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article: any) => (
            <ArticleCard key={article.id} article={article} onClick={() => onArticleClick(article)} />
          ))}
        </div>
      ) : (
        <p className="text-slate-500 dark:text-slate-400">No articles found in this category.</p>
      )}
    </div>
  );
}