import { ArticleCard } from "./ArticleCard";

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

interface ReportsProps {
  reports: Report[];
  onReportClick: (report: Report) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const REPORT_CATEGORIES = ["Company Analysis", "General Report"];

export function Reports({ reports, onReportClick, selectedCategory = "Company Analysis", onCategoryChange }: ReportsProps) {
  const filtered = reports.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-slate-900 dark:text-slate-100">Reports</h1>
          <p className="text-slate-600 dark:text-slate-300">In-depth analysis and comprehensive reports</p>
        </div>

        {/* Sub-category tabs */}
        <div className="flex gap-2 border-b border-slate-200 mb-8 dark:border-slate-700">
          {REPORT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange?.(cat)}
              className={`px-4 py-2 -mb-px border-b-2 transition-colors ${
                selectedCategory === cat
                  ? "border-slate-900 text-slate-900 dark:text-slate-100"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center dark:bg-slate-800">
            <h3 className="mb-2 text-slate-900 dark:text-slate-100">No reports yet</h3>
            <p className="text-slate-600 dark:text-slate-300">
              Reports will appear here once published
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((report) => (
              <ArticleCard
                key={report.id}
                article={report}
                onClick={() => onReportClick(report)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
