import { useState, useRef, useEffect } from "react";
import { Menu, X, Settings, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";

interface NavigationProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAdminClick: () => void;
  onCardNewsClick?: () => void;
}

export function Navigation({ selectedCategory, onCategoryChange, onAdminClick, onCardNewsClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const columnCategories = ["Politics", "Stocks", "Economics"];
  const showCardNews = selectedCategory === "Card News";
  const showReports = selectedCategory === "Reports";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowColumnsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-slate-900 cursor-pointer" onClick={() => onCategoryChange("All")}>
              APERI
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={onCardNewsClick}
              className={`transition-colors ${
                showCardNews
                  ? "text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Daily Card News
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
                className={`flex items-center gap-1 transition-colors ${
                  columnCategories.includes(selectedCategory)
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Columns
                <ChevronDown className={`w-4 h-4 transition-transform ${showColumnsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showColumnsDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 py-2 min-w-[160px] z-50">
                  {columnCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        onCategoryChange(category);
                        setShowColumnsDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 transition-colors ${
                        selectedCategory === category
                          ? "text-slate-900 bg-slate-100"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onCategoryChange("Reports")}
              className={`transition-colors ${
                showReports
                  ? "text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Reports
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onAdminClick}>
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
            <Button variant="default" onClick={() => document.getElementById('subscribe-section')?.scrollIntoView({ behavior: 'smooth' })}>Subscribe</Button>
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
            <button
              onClick={() => {
                onCardNewsClick?.();
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md ${
                showCardNews
                  ? "text-slate-900 bg-slate-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Daily Card News
            </button>

            <div className="py-1">
              <div className="px-3 py-2 text-sm text-slate-900">Columns</div>
              {columnCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-6 py-2 rounded-md ${
                    selectedCategory === category
                      ? "text-slate-900 bg-slate-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                onCategoryChange("Reports");
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md ${
                showReports
                  ? "text-slate-900 bg-slate-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Reports
            </button>
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
              <Button variant="default" className="w-full" onClick={() => { setIsOpen(false); setTimeout(() => document.getElementById('subscribe-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}