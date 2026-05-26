import { ArrowLeft, Download } from "lucide-react";
import { Button } from "./ui/button";

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

interface MagazineViewerProps {
  magazine: Magazine;
  onBack: () => void;
}

export function MagazineViewer({ magazine, onBack }: MagazineViewerProps) {
  return (
    <div className="bg-slate-100 dark:bg-slate-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-3 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">All issues</span>
        </button>

        <div className="min-w-0 flex-1 text-center">
          <p className="text-slate-900 truncate dark:text-slate-100">{magazine.title}</p>
        </div>

        <div className="flex-shrink-0">
          {magazine.pdfUrl ? (
            <a href={magazine.pdfUrl} download={magazine.pdfName || `${magazine.title || "magazine"}.pdf`}>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </a>
          ) : (
            <span className="inline-block w-[72px]" />
          )}
        </div>
      </div>

      {/* Magazine content (rendered in an isolated frame) */}
      {magazine.html ? (
        <iframe
          title={magazine.title}
          srcDoc={magazine.html}
          sandbox="allow-scripts allow-same-origin allow-popups allow-downloads"
          style={{ width: "100%", height: "calc(100vh - 64px - 57px)", border: 0, display: "block" }}
        />
      ) : (
        <div className="flex items-center justify-center" style={{ height: "calc(100vh - 64px - 57px)" }}>
          <p className="text-slate-500 dark:text-slate-400">This issue has no viewable content.</p>
        </div>
      )}
    </div>
  );
}
