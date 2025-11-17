import { ArticleCard } from "./ArticleCard";

interface ArticleGridProps {
  selectedCategory: string;
  onArticleClick: (article: any) => void;
  articles: any[];
}

export function ArticleGrid({ selectedCategory, onArticleClick, articles }: ArticleGridProps) {
  const filteredArticles = selectedCategory === "All" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div>
      <h2 className="mb-6 text-slate-900">
        {selectedCategory === "All" ? "Latest Columns" : `${selectedCategory} Columns`}
      </h2>
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} onClick={() => onArticleClick(article)} />
          ))}
        </div>
      ) : (
        <p className="text-slate-500">No articles found in this category.</p>
      )}
    </div>
  );
}