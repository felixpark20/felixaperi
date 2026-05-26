import { Eye, BookOpen } from "lucide-react";

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

interface MagazineGridProps {
  magazines: Magazine[];
  onMagazineClick: (magazine: Magazine) => void;
}

const COLORS = ["#93C5FD", "#86EFAC", "#C4B5FD", "#FDE68A", "#FCA5A5", "#7DD3FC", "#BBF7D0", "#FED7AA", "#FBCFE8", "#A5B4FC"];

export function MagazineGrid({ magazines, onMagazineClick }: MagazineGridProps) {
  if (!magazines || magazines.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center dark:bg-slate-800">
        <BookOpen className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
        <p className="text-slate-500 dark:text-slate-400">No magazine issues yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {magazines.map((m) => {
        const fallback = COLORS[m.id % COLORS.length];
        return (
          <div
            key={m.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all flex flex-col dark:bg-slate-800"
            onClick={() => onMagazineClick(m)}
          >
            <div className="h-56 overflow-hidden relative" style={{ background: fallback }}>
              {m.cover && (
                <img
                  src={m.cover}
                  alt={m.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              )}
              {m.pdfUrl && (
                <span className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  PDF
                </span>
              )}
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-slate-900 font-semibold line-clamp-2 mb-1 dark:text-slate-100">{m.title}</h3>
              {m.subtitle && (
                <p className="text-slate-600 text-sm line-clamp-2 mb-3 dark:text-slate-300">{m.subtitle}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-slate-400 mt-auto dark:text-slate-500">
                <span>{m.date}</span>
                {m.views !== undefined && (
                  <>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {m.views.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
