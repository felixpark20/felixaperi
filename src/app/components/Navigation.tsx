import { useState, useRef, useEffect } from "react";
import { Menu, X, Settings, ChevronDown, Sun, Moon, Monitor, Lock, Check } from "lucide-react";
import { Button } from "./ui/button";

interface NavigationProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAdminClick: () => void;
  onCardNewsClick?: () => void;
}

type Theme = "light" | "dark" | "system";

export function Navigation({ selectedCategory, onCategoryChange, onAdminClick, onCardNewsClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const reportsDropdownRef = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);

  // Theme state — persisted in localStorage, applied to <html>
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
      const resolved =
        theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : theme;
      root.classList.toggle("dark", resolved === "dark");
    };
    applyTheme();
    localStorage.setItem("theme", theme);

    // React to system preference changes while in "system" mode
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme();
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    }
  }, [theme]);

  const columnCategories = ["Politics", "Stocks", "Economics"];
  const reportCategories = ["Company Analysis", "General Report"];
  const showCardNews = selectedCategory === "Card News";
  const showReports = ["Reports", "Company Analysis", "General Report"].includes(selectedCategory);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowColumnsDropdown(false);
      }
      if (reportsDropdownRef.current && !reportsDropdownRef.current.contains(event.target as Node)) {
        setShowReportsDropdown(false);
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target as Node)) {
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themeOptions: { value: Theme; label: string; icon: any }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 border-b border-transparent dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-slate-900 dark:text-slate-100 cursor-pointer" onClick={() => onCategoryChange("All")}>
              APERI
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={onCardNewsClick}
              className={`transition-colors ${
                showCardNews
                  ? "text-slate-900 dark:text-slate-100"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Daily Card News
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
                className={`flex items-center gap-1 transition-colors ${
                  columnCategories.includes(selectedCategory)
                    ? "text-slate-900 dark:text-slate-100"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Columns
                <ChevronDown className={`w-4 h-4 transition-transform ${showColumnsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showColumnsDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 min-w-[160px] z-50">
                  {columnCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        onCategoryChange(category);
                        setShowColumnsDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 transition-colors ${
                        selectedCategory === category
                          ? "text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={reportsDropdownRef}>
              <button
                onClick={() => setShowReportsDropdown(!showReportsDropdown)}
                className={`flex items-center gap-1 transition-colors ${
                  showReports
                    ? "text-slate-900 dark:text-slate-100"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                Reports
                <ChevronDown className={`w-4 h-4 transition-transform ${showReportsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showReportsDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 min-w-[180px] z-50">
                  {reportCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        onCategoryChange(category);
                        setShowReportsDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 transition-colors ${
                        selectedCategory === category
                          ? "text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Settings (gear) dropdown — contains Theme + Admin */}
            <div className="relative" ref={settingsDropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                aria-label="Settings"
                className="px-2"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {showSettingsDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 min-w-[200px] z-50">
                  <div className="px-3 pt-1 pb-2 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    Theme
                  </div>
                  {themeOptions.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={`flex items-center justify-between w-full px-4 py-2 transition-colors ${
                        theme === value
                          ? "text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {label}
                      </span>
                      {theme === value && <Check className="w-4 h-4" />}
                    </button>
                  ))}

                  <div className="my-2 border-t border-slate-200 dark:border-slate-700" />

                  <button
                    onClick={() => {
                      onAdminClick();
                      setShowSettingsDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Admin
                  </button>
                </div>
              )}
            </div>

            {/* Subscribe — hidden until backend is wired up
            <Button variant="default" onClick={() => document.getElementById('subscribe-section')?.scrollIntoView({ behavior: 'smooth' })}>Subscribe</Button>
            */}
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
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => {
                onCardNewsClick?.();
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md ${
                showCardNews
                  ? "text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              }`}
            >
              Daily Card News
            </button>

            <div className="py-1">
              <div className="px-3 py-2 text-sm text-slate-900 dark:text-slate-100">Columns</div>
              {columnCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-6 py-2 rounded-md ${
                    selectedCategory === category
                      ? "text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="py-1">
              <div className="px-3 py-2 text-sm text-slate-900 dark:text-slate-100">Reports</div>
              {reportCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-6 py-2 rounded-md ${
                    selectedCategory === category
                      ? "text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Mobile Settings section */}
            <div className="py-1 border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
              <div className="px-3 py-2 text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </div>
              <div className="px-3 pb-1 pt-1 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Theme
              </div>
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex items-center justify-between w-full text-left px-6 py-2 rounded-md ${
                    theme === value
                      ? "text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                  {theme === value && <Check className="w-4 h-4" />}
                </button>
              ))}
              <button
                onClick={() => {
                  onAdminClick();
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-6 py-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50 mt-1"
              >
                <Lock className="w-4 h-4" />
                Admin
              </button>
            </div>

            {/* Subscribe (mobile) — hidden until backend is wired up
            <div className="pt-2">
              <Button variant="default" className="w-full" onClick={() => { setIsOpen(false); setTimeout(() => document.getElementById('subscribe-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
                Subscribe
              </Button>
            </div>
            */}
          </div>
        </div>
      )}
    </nav>
  );
}
