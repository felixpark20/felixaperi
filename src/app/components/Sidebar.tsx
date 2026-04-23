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

interface Report {
  id: number;
  title: string;
  category: string;
  date: string;
  views?: number;
}

interface SidebarProps {
  articles: Article[];
  reports?: Report[];
  onCategoryChange: (category: string) => void;
  onSubscribe?: (email: string) => void;
}

export function Sidebar({ articles, reports = [], onCategoryChange, onSubscribe }: SidebarProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Most recent columns (non-external, sorted by id desc)
  const recentColumns = [...articles]
    .filter(a => !a.isExternal)
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  // Most recent reports (sorted by id desc)
  const recentReports = [...reports]
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

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
      {/* Recent Columns */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Recent Columns</h3>
        <div className="space-y-4">
          {recentColumns.length === 0 ? (
            <p className="text-slate-500 text-sm">No columns yet</p>
          ) : recentColumns.map((article) => (
            <div
              key={article.id}
              className="pb-4 border-b border-slate-200 last:border-0 last:pb-0 cursor-pointer hover:text-slate-600 transition-colors"
              onClick={() => onCategoryChange(article.category)}
            >
              <p className="text-slate-900 mb-1 line-clamp-2">{article.title}</p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{article.category}</span>
                <span className="text-slate-300">·</span>
                <span>{article.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Reports */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Recent Reports</h3>
        <div className="space-y-4">
          {recentReports.length === 0 ? (
            <p className="text-slate-500 text-sm">No reports yet</p>
          ) : recentReports.map((report) => (
            <div
              key={report.id}
              className="pb-4 border-b border-slate-200 last:border-0 last:pb-0 cursor-pointer hover:text-slate-600 transition-colors"
              onClick={() => onCategoryChange(report.category)}
            >
              <p className="text-slate-900 mb-1 line-clamp-2">{report.title}</p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>{report.category}</span>
                <span className="text-slate-300">·</span>
                <span>{report.date}</span>
              </div>
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
