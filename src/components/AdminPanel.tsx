import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Pencil, Trash2, Plus, LogOut, Eye } from "lucide-react";
import { ArticleEditor } from "./ArticleEditor";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content?: string;
  views?: number;
}

interface AdminPanelProps {
  articles: Article[];
  onAddArticle: (article: Omit<Article, 'id' | 'date'>) => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (id: number) => void;
  onBack: () => void;
  onLogout: () => void;
}

export function AdminPanel({ articles, onAddArticle, onEditArticle, onDeleteArticle, onBack, onLogout }: AdminPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleNewArticle = () => {
    setEditingArticle(null);
    setIsEditing(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsEditing(true);
  };

  const handleSave = (articleData: Omit<Article, 'id' | 'date'>) => {
    if (editingArticle) {
      onEditArticle({ ...articleData, id: editingArticle.id, date: editingArticle.date } as Article);
    } else {
      onAddArticle(articleData);
    }
    setIsEditing(false);
    setEditingArticle(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingArticle(null);
  };

  if (isEditing) {
    return (
      <ArticleEditor
        article={editingArticle}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="mb-2 text-slate-900">Admin Panel</h1>
              <p className="text-slate-600">Manage your columns and articles</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button variant="outline" onClick={onBack}>
                View Site
              </Button>
              <Button onClick={handleNewArticle}>
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-4">
          {articles.length === 0 ? (
            <Card className="p-12 text-center">
              <h3 className="mb-2 text-slate-900">No articles yet</h3>
              <p className="text-slate-600 mb-6">Start by creating your first column</p>
              <Button onClick={handleNewArticle}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Article
              </Button>
            </Card>
          ) : (
            articles.map((article) => (
              <Card key={article.id} className="p-6">
                <div className="flex gap-6">
                  <div className="w-48 h-32 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block px-2 py-1 rounded text-slate-700 bg-slate-100 mb-2">
                          {article.category}
                        </span>
                        <h3 className="text-slate-900">{article.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this article?')) {
                              onDeleteArticle(article.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-slate-600 mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex gap-4 text-slate-500">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                      {article.views !== undefined && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{article.views.toLocaleString()} views</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}