import { Card } from "./ui/card";
import { TrendingUp } from "lucide-react";

interface SidebarProps {
  onCategoryChange: (category: string) => void;
}

export function Sidebar({ onCategoryChange }: SidebarProps) {
  const popularPosts = [
    {
      id: 1,
      title: "Why Inflation Data Matters More Than Ever",
      category: "Economics"
    },
    {
      id: 2,
      title: "The Rise of ESG Investing",
      category: "Stocks"
    },
    {
      id: 3,
      title: "Foreign Policy in a Multipolar World",
      category: "Politics"
    },
    {
      id: 4,
      title: "Central Bank Digital Currencies: The Future of Money?",
      category: "Economics"
    }
  ];

  const categories = [
    { name: "Politics", count: 24 },
    { name: "Stocks", count: 18 },
    { name: "Economics", count: 21 }
  ];

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
      <Card className="p-6 bg-slate-900 text-white">
        <h3 className="mb-2">Stay Informed</h3>
        <p className="text-slate-300 mb-4">
          Get weekly insights delivered to your inbox.
        </p>
        <input
          type="email"
          placeholder="Your email"
          className="w-full px-4 py-2 rounded-md mb-3 text-slate-900"
        />
        <button className="w-full bg-white text-slate-900 px-4 py-2 rounded-md hover:bg-slate-100 transition-colors">
          Subscribe
        </button>
      </Card>
    </div>
  );
}