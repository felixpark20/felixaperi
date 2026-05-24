import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Upload, X, Trash2, Eye, Pencil, FileText } from "lucide-react";

// Compress image to reduce localStorage usage
const compressImage = (file: File, maxWidth = 1200, quality = 0.75): Promise<string> => {
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

interface CardNews {
  id: number;
  images: string[];
  title: string;
  date: string;
  pdfUrl?: string;
  pdfName?: string;
  views?: number;
}

interface CardNewsUploadProps {
  cardNews: CardNews[];
  onAddCard: (card: Omit<CardNews, 'id' | 'date' | 'views'>) => void;
  onDeleteCard: (id: number) => void;
  onBulkDelete: (ids: number[]) => void;
}

export function CardNewsUpload({ cardNews, onAddCard, onDeleteCard, onBulkDelete }: CardNewsUploadProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today in YYYY-MM-DD format
    return new Date().toISOString().split("T")[0];
  });
  const [images, setImages] = useState<string[]>([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [editingCard, setEditingCard] = useState<CardNews | null>(null);

  // Format date string (YYYY-MM-DD) to readable title e.g. "April 23rd, 2026"
  const formatDateTitle = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T12:00:00");
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? "st"
      : day === 2 || day === 22 ? "nd"
      : day === 3 || day === 23 ? "rd" : "th";
    return date.toLocaleDateString("en-US", { month: "long" }) + " " + day + suffix + ", " + date.getFullYear();
  };

  // Format date for card.date field e.g. "Apr 23, 2026"
  const formatDateField = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    try {
      const imageDataUrls = await Promise.all(fileArray.map((file) => compressImage(file)));
      setImages([...images, ...imageDataUrls]);
    } catch (error) {
      alert('Error reading files. Please try again.');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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
        setPdfUrl(e.target.result as string);
        setPdfName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditCard = (card: CardNews) => {
    setEditingCard(card);
    // Try to reverse-parse date from title, fall back to today
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setImages(card.images || []);
    setPdfUrl(card.pdfUrl || "");
    setPdfName(card.pdfName || "");
    setIsUploading(true);
    setSelectedCards([]);
  };

  const toggleCardSelection = (id: number) => {
    setSelectedCards(prev =>
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedCards.length === 0) return;
    if (confirm(`Delete ${selectedCards.length} selected card news?`)) {
      onBulkDelete(selectedCards);
      setSelectedCards([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || images.length === 0) {
      alert('Please select a date and upload 4-6 images');
      return;
    }

    if (images.length < 4 || images.length > 6) {
      alert('Card news must have 4-6 pages');
      return;
    }

    const title = formatDateTitle(selectedDate);
    const date = formatDateField(selectedDate);

    if (editingCard) {
      onAddCard({ ...editingCard, title, date, images, pdfUrl, pdfName } as any);
    } else {
      onAddCard({ title, date, images, pdfUrl, pdfName } as any);
    }

    setSelectedDate(new Date().toISOString().split("T")[0]);
    setImages([]);
    setPdfUrl("");
    setPdfName("");
    setIsUploading(false);
    setEditingCard(null);
  };

  const handleCancel = () => {
    setIsUploading(false);
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setImages([]);
    setPdfUrl("");
    setPdfName("");
    setEditingCard(null);
  };

  return (
    <div>
      <div className="mb-6 flex gap-3">
        {!isUploading ? (
          <>
            <Button onClick={() => setIsUploading(true)} className="flex-1 sm:flex-none">
              <Upload className="w-4 h-4 mr-2" />
              Add New Card News
            </Button>
            {selectedCards.length > 0 && (
              <Button onClick={handleBulkDelete} variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedCards.length})
              </Button>
            )}
          </>
        ) : (
          <Card className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-900 dark:text-slate-100">
                  {editingCard ? 'Edit Card News' : 'Upload Card News'}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="cardDate" className="block mb-2 text-slate-700 dark:text-slate-200">
                    Date <span className="text-slate-400 text-sm dark:text-slate-500">(becomes the title)</span>
                  </label>
                  <input
                    id="cardDate"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-600"
                    required
                  />
                  {selectedDate && (
                    <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                      Title: <span className="font-medium text-slate-700 dark:text-slate-200">{formatDateTitle(selectedDate)}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-slate-700 dark:text-slate-200">
                    Card News Images (Upload 4-6 images)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-600"
                  />
                  <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                    Select 4-6 images to create a card news carousel
                  </p>
                  {images.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-slate-600 mb-2 dark:text-slate-300">
                        {images.length} image{images.length !== 1 ? 's' : ''} added
                        {images.length < 4 && ' (need at least 4)'}
                        {images.length > 6 && ' (maximum 6 allowed)'}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((img, index) => (
                          <div key={index} className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden group dark:bg-slate-700">
                            <img
                              src={img}
                              alt={`Page ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              Page {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-slate-700 dark:text-slate-200">
                    PDF Report (Optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfFileChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 dark:border-slate-600"
                  />
                  <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                    Upload a detailed PDF version (optional)
                  </p>

                  {pdfUrl && (
                    <div className="mt-3 p-4 bg-slate-100 rounded-lg flex items-center justify-between dark:bg-slate-700">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-slate-600 dark:text-slate-300" />
                        <div>
                          <p className="text-slate-900 dark:text-slate-100">{pdfName || 'Report.pdf'}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">PDF uploaded</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfUrl("");
                          setPdfName("");
                        }}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={images.length < 4 || images.length > 6}>
                    {editingCard ? 'Update Card News' : 'Add Card News'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {cardNews.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-slate-600 dark:text-slate-300">No card news uploaded yet</p>
          </Card>
        ) : (
          cardNews.map((card) => (
            <Card key={card.id} className="p-4">
              <div className="flex gap-4">
                <input
                  type="checkbox"
                  checked={selectedCards.includes(card.id)}
                  onChange={() => toggleCardSelection(card.id)}
                  className="w-5 h-5 mt-1"
                />
                <div className="flex gap-3 overflow-x-auto flex-shrink-0">
                  {(card.images || []).map((img, idx) => (
                    <div key={idx} className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative dark:bg-slate-700">
                      <img
                        src={img}
                        alt={`${card.title} - Page ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-0.5">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-slate-900 mb-1 truncate dark:text-slate-100">{card.title}</h4>
                      <div className="flex gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <span>{card.date}</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span>{(card.images || []).length} pages</span>
                        {card.views !== undefined && (
                          <>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{card.views.toLocaleString()}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCard(card)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this card news?')) {
                            onDeleteCard(card.id);
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
