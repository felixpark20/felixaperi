import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Pencil, Trash2, Plus, LogOut, Eye, FileText, Image as ImageIcon, BookOpen, Newspaper } from "lucide-react";
import { ArticleEditor } from "./ArticleEditor";
import { CardNewsUpload } from "./CardNewsUpload";
import { ReportEditor } from "./ReportEditor";
import { MagazineUpload } from "./MagazineUpload";

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

interface CardNews {
  id: number;
  images: string[];
  title: string;
  date: string;
  pdfUrl?: string;
  pdfName?: string;
  views?: number;
}

interface Report {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  pdfUrl: string;
  pdfName?: string;
  views?: number;
}

interface Magazine {
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  cover?: string;
  html?: string;
  pdfUrl?: string;
  pdfName?: string;
  views?: number;
}

interface AdminPanelProps {
  articles: Article[];
  cardNews: CardNews[];
  reports: Report[];
  magazines: Magazine[];
  onAddArticle: (article: Omit<Article, 'id' | 'date'>) => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (id: number) => void;
  onBulkDeleteArticles: (ids: number[]) => void;
  onAddCard: (card: Omit<CardNews, 'id' | 'date' | 'views'>) => void;
  onDeleteCard: (id: number) => void;
  onBulkDeleteCards: (ids: number[]) => void;
  onAddReport: (report: Omit<Report, 'id' | 'date'>) => void;
  onEditReport: (report: Report) => void;
  onDeleteReport: (id: number) => void;
  onBulkDeleteReports: (ids: number[]) => void;
  onAddMagazine: (magazine: any) => void;
  onDeleteMagazine: (id: number) => void;
  onBulkDeleteMagazines: (ids: number[]) => void;
  onBack: () => void;
  onLogout: () => void;
}

export function AdminPanel({ articles, cardNews, reports, magazines, onAddArticle, onEditArticle, onDeleteArticle, onBulkDeleteArticles, onAddCard, onDeleteCard, onBulkDeleteCards, onAddReport, onEditReport, onDeleteReport, onBulkDeleteReports, onAddMagazine, onDeleteMagazine, onBulkDeleteMagazines, onBack, onLogout }: AdminPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<"articles" | "cardnews" | "reports" | "magazines">("articles");
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const [selectedReports, setSelectedReports] = useState<number[]>([]);

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
    setEditingReport(null);
  };

  const handleNewReport = () => {
    setEditingReport(null);
    setIsEditing(true);
  };

  const handleEditReport = (report: Report) => {
    setEditingReport(report);
    setIsEditing(true);
  };

  const handleSaveReport = (reportData: Omit<Report, 'id' | 'date'>) => {
    if (editingReport) {
      onEditReport({ ...reportData, id: editingReport.id, date: editingReport.date } as Report);
    } else {
      onAddReport(reportData);
    }
    setIsEditing(false);
    setEditingReport(null);
  };

  const toggleArticleSelection = (id: number) => {
    setSelectedArticles(prev =>
      prev.includes(id) ? prev.filter(articleId => articleId !== id) : [...prev, id]
    );
  };

  const toggleReportSelection = (id: number) => {
    setSelectedReports(prev =>
      prev.includes(id) ? prev.filter(reportId => reportId !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteArticles = () => {
    if (selectedArticles.length === 0) return;
    if (confirm(`Delete ${selectedArticles.length} selected article${selectedArticles.length > 1 ? 's' : ''}?`)) {
      onBulkDeleteArticles(selectedArticles);
      setSelectedArticles([]);
    }
  };

  const handleBulkDeleteReports = () => {
    if (selectedReports.length === 0) return;
    if (confirm(`Delete ${selectedReports.length} selected report${selectedReports.length > 1 ? 's' : ''}?`)) {
      onBulkDeleteReports(selectedReports);
      setSelectedReports([]);
    }
  };

  if (isEditing) {
    if (activeTab === "reports" || editingReport) {
      return (
        <ReportEditor
          report={editingReport}
          onSave={handleSaveReport}
          onCancel={handleCancel}
        />
      );
    }
    return (
      <ArticleEditor
        article={editingArticle}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="mb-2 text-slate-900 dark:text-slate-100">Admin Panel</h1>
              <p className="text-slate-600 dark:text-slate-300">Manage your columns, card news, and reports</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button variant="outline" onClick={onBack}>
                View Site
              </Button>
              {activeTab === "articles" && (
                <Button onClick={handleNewArticle}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Article
                </Button>
              )}
              {activeTab === "reports" && (
                <Button onClick={handleNewReport}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Report
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("articles")}
              className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
                activeTab === "articles"
                  ? "border-slate-900 text-slate-900 dark:text-slate-100"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Articles ({articles.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("cardnews")}
              className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
                activeTab === "cardnews"
                  ? "border-slate-900 text-slate-900 dark:text-slate-100"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Card News ({cardNews.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
                activeTab === "reports"
                  ? "border-slate-900 text-slate-900 dark:text-slate-100"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Reports ({reports.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("magazines")}
              className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
                activeTab === "magazines"
                  ? "border-slate-900 text-slate-900 dark:text-slate-100"
                  : "border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                Magazine ({magazines.length})
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "articles" ? (
          <div>
            {selectedArticles.length > 0 && (
              <div className="mb-4">
                <Button onClick={handleBulkDeleteArticles} variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedArticles.length})
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
              {articles.length === 0 ? (
                <Card className="p-12 text-center">
                  <h3 className="mb-2 text-slate-900 dark:text-slate-100">No articles yet</h3>
                  <p className="text-slate-600 mb-6 dark:text-slate-300">Start by creating your first column</p>
                  <Button onClick={handleNewArticle}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Article
                  </Button>
                </Card>
              ) : (
                articles.map((article) => (
                <Card key={article.id} className="p-6">
                  <div className="flex gap-6">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id)}
                      onChange={() => toggleArticleSelection(article.id)}
                      className="w-5 h-5 mt-1"
                    />
                    <div className="w-48 h-32 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 dark:bg-slate-700">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block px-2 py-1 rounded text-slate-700 bg-slate-100 mb-2 dark:text-slate-200 dark:bg-slate-700">
                          {article.category}
                        </span>
                        <h3 className="text-slate-900 dark:text-slate-100">{article.title}</h3>
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
                    <p className="text-slate-600 mb-4 line-clamp-2 dark:text-slate-300">{article.excerpt}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="whitespace-nowrap">{article.date}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="whitespace-nowrap">{article.readTime}</span>
                      {article.views !== undefined && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <Eye className="w-4 h-4 flex-shrink-0" />
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
        ) : activeTab === "cardnews" ? (
          <CardNewsUpload
            cardNews={cardNews}
            onAddCard={onAddCard}
            onDeleteCard={onDeleteCard}
            onBulkDelete={onBulkDeleteCards}
          />
        ) : activeTab === "magazines" ? (
          <MagazineUpload
            magazines={magazines}
            onAddMagazine={onAddMagazine}
            onDeleteMagazine={onDeleteMagazine}
            onBulkDelete={onBulkDeleteMagazines}
          />
        ) : (
          <div>
            {selectedReports.length > 0 && (
              <div className="mb-4">
                <Button onClick={handleBulkDeleteReports} variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedReports.length})
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
              {reports.length === 0 ? (
                <Card className="p-12 text-center">
                  <h3 className="mb-2 text-slate-900 dark:text-slate-100">No reports yet</h3>
                  <p className="text-slate-600 mb-6 dark:text-slate-300">Start by creating your first report</p>
                  <Button onClick={handleNewReport}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Report
                  </Button>
                </Card>
              ) : (
                reports.map((report) => (
                  <Card key={report.id} className="p-6">
                    <div className="flex gap-6">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => toggleReportSelection(report.id)}
                        className="w-5 h-5 mt-1"
                      />
                      <div className="w-48 h-32 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 dark:bg-slate-700">
                        <img
                          src={report.image}
                          alt={report.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="inline-block px-2 py-1 rounded text-slate-700 bg-slate-100 mb-2 dark:text-slate-200 dark:bg-slate-700">
                              {report.category}
                            </span>
                            <h3 className="text-slate-900 dark:text-slate-100">{report.title}</h3>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditReport(report)}
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this report?')) {
                                  onDeleteReport(report.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-slate-600 mb-4 line-clamp-2 dark:text-slate-300">{report.excerpt}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                          <span className="whitespace-nowrap">{report.date}</span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="whitespace-nowrap">{report.readTime}</span>
                          {report.views !== undefined && (
                            <>
                              <span className="text-slate-300 dark:text-slate-600">•</span>
                              <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <Eye className="w-4 h-4 flex-shrink-0" />
                                <span>{report.views.toLocaleString()} views</span>
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
        )}
      </div>
    </div>
  );
}