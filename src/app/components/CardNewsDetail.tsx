import { useState } from "react";
import { ArrowLeft, Eye, Calendar, ChevronLeft, ChevronRight, FileText, ExternalLink, Download } from "lucide-react";
import { Button } from "./ui/button";

interface CardNews {
  id: number;
  images: string[];
  title: string;
  date: string;
  pdfUrl?: string;
  pdfName?: string;
  views?: number;
}

interface CardNewsDetailProps {
  card: CardNews;
  onBack: () => void;
}

export function CardNewsDetail({ card, onBack }: CardNewsDetailProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const images = card.images || [];
  const totalPages = images.length;

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Card News
        </Button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden dark:bg-slate-800">
          <div className="relative aspect-square max-h-[600px] bg-slate-100 overflow-hidden mx-auto dark:bg-slate-700">
            {images.length > 0 && (
              <img
                src={images[currentPage]}
                alt={`${card.title} - Page ${currentPage + 1}`}
                className="w-full h-full object-contain"
              />
            )}

            {totalPages > 1 && (
              <>
                <button
                  onClick={goToPrevPage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNextPage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentPage + 1} / {totalPages}
                </div>
              </>
            )}
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 overflow-x-auto dark:border-slate-700">
              <div className="flex gap-2 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                      idx === currentPage
                        ? "border-slate-900"
                        : "border-slate-200 hover:border-slate-400 dark:border-slate-700"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Page ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 border-t border-slate-200 dark:border-slate-700">
            <h1 className="mb-4 text-slate-900 dark:text-slate-100">{card.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{card.date}</span>
              </div>
              {card.views !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{card.views.toLocaleString()} views</span>
                </div>
              )}
              {card.pdfUrl && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Detailed PDF Report Available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {card.pdfUrl && (
          <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden dark:bg-slate-800">
            <div className="p-4 bg-slate-100 border-b border-slate-200 dark:bg-slate-700 dark:border-slate-700">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-slate-900 flex items-center gap-2 dark:text-slate-100">
                    <FileText className="w-5 h-5" />
                    Detailed Report
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 dark:text-slate-300">
                    {card.pdfName || 'Full report in PDF format'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={card.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                    새 탭에서 열기
                  </a>
                  <a
                    href={card.pdfUrl}
                    download={card.pdfName || `${card.title}.pdf`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-slate-300 text-slate-700 hover:bg-white transition-colors dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600"
                  >
                    <Download className="w-4 h-4" />
                    다운로드
                  </a>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 sm:hidden dark:text-slate-400">
                PDF가 아래에 안 보이면 "새 탭에서 열기"를 눌러주세요.
              </p>
            </div>
            <div className="w-full h-[75vh] sm:h-[800px]">
              <iframe
                src={card.pdfUrl}
                className="w-full h-full border-0"
                title={`${card.title} - PDF Report`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
