import { Card } from "./ui/card";
import { useState } from "react";

interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  views?: number;
  isExternal?: boolean;
}

interface SidebarProps {
  articles: Article[];
  reports?: any[];
  onCategoryChange: (category: string) => void;
  onSubscribe?: (email: string) => void;
}

export function Sidebar({ articles, onCategoryChange, onSubscribe }: SidebarProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Popular posts: sorted by views descending
  const popularPosts = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  // Categories: always show default set, merge with any from articles
  const defaultCategories = ["Politics", "Stocks", "Economics"];
  const articleCategories = Array.from(new Set(articles.map(a => a.category)));
  const categories = Array.from(new Set([...defaultCategories, ...articleCategories]));

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }
    if (onSubscribe) onSubscribe(email);
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('subscribers', JSON.stringify(subscribers));
    }
    setSubscribed(true);
    setEmail("");
    alert('Successfully subscribed! You will receive notifications when new content is published.');
  };

  return (
    <div className="space-y-6">
      {/* Popular Posts */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4 dark:text-slate-100">Popular Posts</h3>
        <div className="space-y-4">
          {popularPosts.length === 0 ? (
            <p className="text-slate-500 text-sm dark:text-slate-400">No posts yet</p>
          ) : popularPosts.map((article) => (
            <div
              key={article.id}
              className="pb-4 border-b border-slate-200 last:border-0 last:pb-0 cursor-pointer hover:text-slate-600 transition-colors dark:border-slate-700 dark:hover:text-slate-300"
              onClick={() => onCategoryChange(article.category)}
            >
              <p className="text-slate-900 mb-1 line-clamp-2 dark:text-slate-100">{article.title}</p>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span>{article.category}</span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span>{(article.views || 0).toLocaleString()} views</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Categories */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4 dark:text-slate-100">Categories</h3>
        <div className="space-y-2">
          {categories.length === 0 ? (
            <p className="text-slate-500 text-sm dark:text-slate-400">No categories yet</p>
          ) : categories.map((category) => (
            <button
              key={category}
              className="w-full text-left px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-sm dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-slate-100"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </Card>

      {/* Newsletter — hidden until backend is wired up */}
      {false && (
        <Card id="subscribe-section" className="p-6 bg-slate-900 text-white dark:bg-slate-950">
          <h3 className="mb-2">Stay Informed</h3>
          <p className="text-slate-300 mb-4 dark:text-slate-600">
            Get notified when new columns and reports are published.
          </p>
          {subscribed ? (
            <div className="bg-green-600 text-white px-4 py-3 rounded-md text-center">
              ✓ Subscribed!
            </div>
          ) : (
            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-md mb-3 bg-transparent border border-white text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="w-full bg-white text-slate-900 px-4 py-2 rounded-md hover:bg-slate-100 transition-colors dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                Subscribe
              </button>
            </form>
          )}
        </Card>
      )}
    </div>
  );
}
