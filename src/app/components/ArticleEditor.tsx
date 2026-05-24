import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content?: string;
  isExternal?: boolean;
  externalLink?: string;
}

interface ArticleEditorProps {
  article: Article | null;
  onSave: (article: Omit<Article, 'id' | 'date'>) => void;
  onCancel: () => void;
}

// Function to calculate reading time based on word count
const calculateReadingTime = (text: string): string => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

export function ArticleEditor({ article, onSave, onCancel }: ArticleEditorProps) {
  const [formData, setFormData] = useState({
    title: article?.title || "",
    excerpt: article?.excerpt || "",
    category: article?.category || "Politics",
    image: article?.image || "",
    content: article?.content || "",
    isExternal: article?.isExternal || false,
    externalLink: article?.externalLink || ""
  });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
      setUploading(false);
    };
    reader.onerror = () => {
      alert('Failed to read file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Auto-calculate reading time when content changes
  useEffect(() => {
    if (formData.content) {
      const autoReadTime = calculateReadingTime(formData.content);
      setFormData(prev => ({ ...prev, readTime: autoReadTime }));
    }
  }, [formData.content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const wordCount = formData.content.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    
    onSave({
      ...article,
      ...formData,
      readTime: `${readTime} min read`
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-slate-900 dark:text-slate-100">
              {article ? 'Edit Article' : 'New Article'}
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
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter article title"
                  required
                  className="mt-2"
                />
              </div>

              {/* Category */}
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
                    <SelectItem value="Politics">Politics</SelectItem>
                    <SelectItem value="Stocks">Stocks</SelectItem>
                    <SelectItem value="Economics">Economics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary of the article (appears on article cards)"
                  required
                  rows={3}
                  className="mt-2"
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label className="block mb-2">Article Image</Label>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Or paste image URL here"
                      />
                    </div>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button type="button" variant="outline" asChild>
                          <span className="cursor-pointer">
                            {uploading ? "Uploading..." : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Image
                              </>
                            )}
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                  {formData.image && (
                    <div className="relative w-full h-48 bg-slate-100 rounded-lg overflow-hidden group dark:bg-slate-700">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=400&fit=crop";
                        }}
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
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="isExternal"
                    checked={formData.isExternal}
                    onChange={(e) => setFormData({ ...formData, isExternal: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isExternal" className="cursor-pointer">
                    This is an external link (e.g., Fox News article)
                  </label>
                </div>

                {formData.isExternal && (
                  <div className="mb-4">
                    <label className="block mb-2">External Link URL</label>
                    <input
                      type="text"
                      value={formData.externalLink}
                      onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md dark:border-slate-600"
                      placeholder="https://www.foxnews.com/article-url"
                      required={formData.isExternal}
                    />
                    <p className="text-slate-500 mt-1 dark:text-slate-400">
                      When clicked, this article will open the external link in a new tab
                    </p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <Label className="block mb-2">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your full article content here... You can include multiple paragraphs."
                  required
                  rows={15}
                  className="mt-2"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-slate-500 dark:text-slate-400">
                    Tip: Separate paragraphs with double line breaks
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    📖 Reading time: <strong>{formData.readTime}</strong> (auto-calculated)
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button type="submit" className="flex-1">
                {article ? 'Update Article' : 'Publish Article'}
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