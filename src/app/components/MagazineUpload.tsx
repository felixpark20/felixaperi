import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Upload, X, Trash2, Eye, Pencil, FileText, FileCode } from "lucide-react";

// Compress cover image to keep stored payload small
const compressImage = (file: File, maxWidth = 1000, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas not supported")); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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

interface MagazineUploadProps {
  magazines: Magazine[];
  onAddMagazine: (magazine: any) => void;
  onDeleteMagazine: (id: number) => void;
  onBulkDelete: (ids: number[]) => void;
}

export function MagazineUpload({ magazines, onAddMagazine, onDeleteMagazine, onBulkDelete }: MagazineUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [editingMagazine, setEditingMagazine] = useState<Magazine | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [date, setDate] = useState(() =>
    new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
  );
  const [cover, setCover] = useState("");
  const [html, setHtml] = useState("");
  const [htmlName, setHtmlName] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfName, setPdfName] = useState("");

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setDate(new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }));
    setCover("");
    setHtml("");
    setHtmlName("");
    setPdfUrl("");
    setPdfName("");
    setEditingMagazine(null);
    setIsUploading(false);
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setCover(await compressImage(file));
    } catch {
      alert("Error reading the cover image. Please try again.");
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith(".html") && !name.endsWith(".htm") && file.type !== "text/html") {
      alert("Please upload an .html file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        setHtml(ev.target.result);
        setHtmlName(file.name);
      }
    };
    reader.readAsText(file);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPdfUrl(ev.target.result as string);
        setPdfName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (m: Magazine) => {
    setEditingMagazine(m);
    setTitle(m.title || "");
    setSubtitle(m.subtitle || "");
    setDate(m.date || "");
    setCover(m.cover || "");
    setHtml(m.html || "");
    setHtmlName(m.html ? "current.html" : "");
    setPdfUrl(m.pdfUrl || "");
    setPdfName(m.pdfName || "");
    setIsUploading(true);
    setSelected([]);
  };

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (confirm(`Delete ${selected.length} selected issue${selected.length > 1 ? "s" : ""}?`)) {
      onBulkDelete(selected);
      setSelected([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!html) {
      alert("Please upload the magazine HTML file");
      return;
    }
    const payload: any = { title, subtitle, date, cover, html, pdfUrl, pdfName };
    if (editingMagazine) {
      payload.id = editingMagazine.id;
      payload.date = editingMagazine.date;
      payload.views = editingMagazine.views;
    }
    onAddMagazine(payload);
    resetForm();
  };

  return (
    <div>
      <div className="mb-6 flex gap-3">
        {!isUploading ? (
          <>
            <Button onClick={() => setIsUploading(true)} className="flex-1 sm:flex-none">
              <Upload className="w-4 h-4 mr-2" />
              Add New Issue
            </Button>
            {selected.length > 0 && (
              <Button onClick={handleBulkDelete} variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selected.length})
              </Button>
            )}
          </>
        ) : (
          <Card className="p-6 w-full">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-900 dark:text-slate-100">
                  {editingMagazine ? "Edit Issue" : "Upload Magazine Issue"}
                </h3>
                <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-slate-700 dark:text-slate-200">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 이생 ISAENG — No.08"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-slate-700 dark:text-slate-200">
                    Subtitle <span className="text-slate-400 text-sm dark:text-slate-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. 매일의 발견"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-slate-700 dark:text-slate-200">
                    Date / Issue label
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. May 2026"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-slate-700 dark:text-slate-200">
                    Cover image <span className="text-slate-400 text-sm dark:text-slate-500">(optional — shown on the grid)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-600"
                  />
                  {cover && (
                    <div className="mt-3 w-40 h-28 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                      <img src={cover} alt="cover preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-slate-700 dark:text-slate-200">
                    Magazine HTML file <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".html,.htm,text/html"
                    onChange={handleHtmlChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-600"
                  />
                  <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                    Upload one self-contained .html file (everything inlined). This is what readers see.
                  </p>
                  {html && (
                    <div className="mt-3 p-3 bg-slate-100 rounded-lg flex items-center justify-between dark:bg-slate-700">
                      <div className="flex items-center gap-3">
                        <FileCode className="w-7 h-7 text-slate-600 dark:text-slate-300" />
                        <div>
                          <p className="text-slate-900 dark:text-slate-100">{htmlName || "magazine.html"}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{Math.round(html.length / 1024)} KB loaded</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setHtml(""); setHtmlName(""); }}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-slate-700 dark:text-slate-200">
                    PDF download <span className="text-slate-400 text-sm dark:text-slate-500">(optional)</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-600"
                  />
                  <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                    Readers get a "PDF" download button when this is provided.
                  </p>
                  {pdfUrl && (
                    <div className="mt-3 p-3 bg-slate-100 rounded-lg flex items-center justify-between dark:bg-slate-700">
                      <div className="flex items-center gap-3">
                        <FileText className="w-7 h-7 text-slate-600 dark:text-slate-300" />
                        <div>
                          <p className="text-slate-900 dark:text-slate-100">{pdfName || "magazine.pdf"}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">PDF uploaded</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setPdfUrl(""); setPdfName(""); }}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={!title.trim() || !html}>
                    {editingMagazine ? "Update Issue" : "Add Issue"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {magazines.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-600 dark:text-slate-300">No magazine issues uploaded yet</p>
          </Card>
        ) : (
          magazines.map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex gap-4">
                <input
                  type="checkbox"
                  checked={selected.includes(m.id)}
                  onChange={() => toggleSelect(m.id)}
                  className="w-5 h-5 mt-1"
                />
                <div className="w-28 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 dark:bg-slate-700">
                  {m.cover && <img src={m.cover} alt={m.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-900 mb-1 truncate dark:text-slate-100">{m.title}</h4>
                      <div className="flex gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <span>{m.date}</span>
                        {m.pdfUrl && (
                          <>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span>PDF</span>
                          </>
                        )}
                        {m.views !== undefined && (
                          <>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {m.views.toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(m)}>
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this issue?")) {
                            onDeleteMagazine(m.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
