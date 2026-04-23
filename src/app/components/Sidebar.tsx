import { Card } from "./ui/card";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

interface Article {
  id: number;
  title: string;
  category: string;
  views?: number;
  isExternal?: boolean;
}

interface SidebarProps {
  articles: Article[];
  onCategoryChange: (category: string) => void;
  onSubscribe?: (email: string) => void;
}

export function Sidebar({ articles, onCategoryChange, onSubscribe }: SidebarProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Calculate popular posts based on views
  const popularPosts = articles
    .filter(article => !article.isExternal && article.views !== undefined)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  // Calculate category counts
  const categoryMap = articles.reduce((acc, article) => {
    if (article.category === "Politics" || article.category === "Stocks" || article.category === "Economics") {
      acc[article.category] = (acc[article.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const categories = [
    { name: "Politics", count: categoryMap["Politics"] || 0 },
    { name: "Stocks", count: categoryMap["Stocks"] || 0 },
    { name: "Economics", count: categoryMap["Economics"] || 0 }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }

    if (onSubscribe) {
      onSubscribe(email);
    }

    // Save to localStorage
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
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-slate-900" />
          <h3 className="text-slate-900">Popular Posts</h3>
        </div>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <div
              key={post.id}
              className="pb-4 border-b border-slate-200 last:border-0 last:pb-0 cursor-pointer hover:text-slate-600 transition-colors"
            >
              <p className="text-slate-900 mb-1">
                {post.title}
              </p>
              <p className="text-slate-500">
                {post.category}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Categories */}
      <Card className="p-6">
        <h3 className="mb-4 text-slate-900">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => onCategoryChange(category.name)}
              className="flex justify-between items-center cursor-pointer hover:text-slate-600 transition-colors"
            >
              <span className="text-slate-900">{category.name}</span>
              <span className="text-slate-500">({category.count})</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Newsletter */}
      <Card id="subscribe-section" className="p-6 bg-slate-900 text-white">
        <h3 className="mb-2">Stay Informed</h3>
        <p className="text-slate-300 mb-4">
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
              className="w-full bg-white text-slate-900 px-4 py-2 rounded-md hover:bg-slate-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}