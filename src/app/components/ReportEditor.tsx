import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, FileText, Trash2 } from "lucide-react";

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

interface ReportEditorProps {
  report: Report | null;
  onSave: (report: Omit<Report, 'id' | 'date'>) => void;
  onCancel: () => void;
}

export function ReportEditor({ report, onSave, onCancel }: ReportEditorProps) {
  const [formData, setFormData] = useState({
    title: report?.title || "",
    excerpt: report?.excerpt || "",
    category: report?.category || "Company Analysis",
    image: report?.image || "",
    pdfUrl: report?.pdfUrl || "",
    pdfName: report?.pdfName || "",
    readTime: report?.readTime || "5 min read"
  });
  const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "file">("url");

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormData({ ...formData, image: e.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePdfFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormData({
          ...formData,
          pdfUrl: e.target.result as string,
          pdfName: file.name
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pdfUrl) {
      alert('Please upload a PDF file');
      return;
    }

    onSave({
      title: formData.title,
      excerpt: formData.excerpt,
      category: formData.category,
      image: formData.image,
      pdfUrl: formData.pdfUrl,
      pdfName: formData.pdfName,
      readTime: formData.readTime,
      views: report?.views || 0
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-slate-900 dark:text-slate-100">
              {report ? 'Edit Report' : 'New Report'}
            </h1>
            <Button variant="ghost" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter report title"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Company Analysis">Company Analysis</SelectItem>
                    <SelectItem value="General Report">General Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of the report"
                  required
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="block mb-2">Cover Image</Label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageUploadMethod("url")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      imageUploadMethod === "url"
                        ? "bg-slate-900 text-white dark:bg-slate-950"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200"
                    }`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadMethod("file")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      imageUploadMethod === "file"
                        ? "bg-slate-900 text-white dark:bg-slate-950"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200"
                    }`}
                  >
                    File Upload
                  </button>
                </div>

                {imageUploadMethod === "url" ? (
                  <Input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Paste image URL here"
                    required
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-600"
                  />
                )}

                {formData.image && (
                  <div className="mt-3 relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden group dark:bg-slate-700">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>

              <div>
                <Label className="block mb-2">PDF Report File</Label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfFileChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-600"
                  required={!formData.pdfUrl}
                />
                <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                  Upload the full report as a PDF file
                </p>

                {formData.pdfUrl && (
                  <div className="mt-3 p-4 bg-slate-100 rounded-lg flex items-center justify-between dark:bg-slate-700">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-slate-600 dark:text-slate-300" />
                      <div>
                        <p className="text-slate-900 dark:text-slate-100">{formData.pdfName || 'Report.pdf'}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">PDF uploaded</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, pdfUrl: "", pdfName: "" })}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="readTime">Estimated Reading Time</Label>
                <Input
                  id="readTime"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="e.g., 10 min read"
                  className="mt-2"
                />
                <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                  Manually set the estimated reading time for this report
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button type="submit" className="flex-1">
                {report ? 'Update Report' : 'Publish Report'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}
