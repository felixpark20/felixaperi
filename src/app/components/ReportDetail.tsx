import { ArrowLeft, Eye, Calendar, FileText } from "lucide-react";
import { Button } from "./ui/button";

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

interface ReportDetailProps {
  report: Report;
  onBack: () => void;
}

export function ReportDetail({ report, onBack }: ReportDetailProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8 dark:bg-slate-800">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block px-3 py-1 rounded text-slate-700 bg-slate-100 dark:text-slate-200 dark:bg-slate-700">
                {report.category}
              </span>
            </div>

            <h1 className="mb-4 text-slate-900 dark:text-slate-100">{report.title}</h1>

            <p className="text-slate-600 mb-6 dark:text-slate-300">{report.excerpt}</p>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600 border-t border-slate-200 pt-4 dark:text-slate-300 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{report.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>{report.readTime}</span>
              </div>
              {report.views !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{report.views.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-slate-800">
          <div className="w-full" style={{ height: 'calc(100vh - 160px)', minHeight: '900px' }}>
            <iframe
              src={report.pdfUrl}
              className="w-full h-full border-0"
              title={report.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
