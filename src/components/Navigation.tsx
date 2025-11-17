import { useState } from "react";
import { Menu, X, Settings } from "lucide-react";
import { Button } from "./ui/button";

interface NavigationProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAdminClick: () => void;
}

export function Navigation({ selectedCategory, onCategoryChange, onAdminClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const categories = ["All", "Politics", "Stocks", "Economics"];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-slate-900 cursor-pointer" onClick={() => onCategoryChange("All")}>
              The Column
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`transition-colors ${
                  selectedCategory === category
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onAdminClick}>
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
            <Button variant="default">Subscribe</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  onCategoryChange(category);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  selectedCategory === category
                    ? "text-slate-900 bg-slate-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
            <div className="pt-2 space-y-2">
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => {
                  onAdminClick();
                  setIsOpen(false);
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
              <Button variant="default" className="w-full">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}