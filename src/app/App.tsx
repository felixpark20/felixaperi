import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { ArticleGrid } from "./components/ArticleGrid";
import { Sidebar } from "./components/Sidebar";
import { ArticleDetail } from "./components/ArticleDetail";
import { AdminPanel } from "./components/AdminPanel";
import { Login } from "./components/Login";
import { CardNewsGrid } from "./components/CardNewsGrid";
import { CardNewsDetail } from "./components/CardNewsDetail";
import { TodayCardNews } from "./components/TodayCardNews";
import { Reports } from "./components/Reports";
import { ReportDetail } from "./components/ReportDetail";
import { useState, useEffect } from "react";

// Sample initial articles
const initialArticles = [
  {
    id: 1,
    title: "Congressional Budget Showdown: What's at Stake",
    excerpt:
      "With the deadline approaching, lawmakers face mounting pressure to reach a compromise on the federal budget amid partisan divisions.",
    category: "Politics",
    date: "Nov 17, 2025",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop",
    content:
      "Washington faces another potential government shutdown as House and Senate leaders struggle to find common ground on the upcoming fiscal year budget. The primary sticking points include defense spending, social programs, and border security funding.\n\nRepublican lawmakers are pushing for increased border security measures and reduced spending on social programs, while Democrats advocate for expanded healthcare coverage and climate initiatives. The standoff has created uncertainty in financial markets and among federal employees.\n\nBoth parties acknowledge the need to avoid a shutdown, but disagree on the path forward. Committee hearings this week revealed deep divisions on fundamental budget priorities. Some moderates from both sides have begun informal discussions to forge a compromise.\n\nThe outcome will have significant implications for the 2026 election cycle, with both parties seeking to claim victory while avoiding blame for potential disruptions to government services.",
    views: 1847,
  },
  {
    id: 2,
    title: "Senate Immigration Bill Faces Uncertain Future",
    excerpt:
      "A bipartisan immigration proposal promises border security enhancements alongside pathway to citizenship, but faces resistance from both extremes.",
    category: "Politics",
    date: "Nov 16, 2025",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1541872703-74c34d9d3027?w=600&h=400&fit=crop",
    content:
      "A group of Senate moderates has unveiled a comprehensive immigration reform package that attempts to address border security concerns while providing legal status pathways for long-term undocumented residents.\n\nThe proposal includes funding for border technology, increased personnel, and expedited processing for asylum claims. It also creates merit-based visas and agricultural worker programs that business groups have long requested.\n\nHowever, the bill faces opposition from immigration hardliners who view any pathway to citizenship as amnesty, as well as from progressives who argue the border security measures are too restrictive. The sponsors need 60 votes to overcome a filibuster.\n\nEarly polling suggests public support for a balanced approach, but political realities in an election year make passage uncertain. The administration has indicated willingness to support a compromise that addresses both security and humanitarian concerns.",
    views: 1523,
  },
  {
    id: 3,
    title: "State Election Laws Under Federal Court Review",
    excerpt:
      "Multiple states face legal challenges to voting legislation as courts examine claims of voter suppression versus election integrity.",
    category: "Politics",
    date: "Nov 15, 2025",
    readTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1577305375602-4ab659fc5097?w=600&h=400&fit=crop",
    content:
      "Federal courts are weighing several high-profile challenges to state voting laws enacted over the past two years, with significant implications for upcoming elections.\n\nSupporters of the laws argue they enhance election security and prevent fraud through voter ID requirements, signature verification, and limits on mail-in ballot collection. Critics contend these measures disproportionately affect minority voters and elderly citizens.\n\nLegal experts note that courts have historically given states broad authority over election administration while also protecting fundamental voting rights. The Supreme Court may ultimately need to resolve conflicting circuit court decisions.\n\nCivil rights organizations have mobilized voter registration and education efforts, while state officials defend their laws as common-sense safeguards. The outcome will shape election procedures nationwide.",
    views: 1289,
  },
  {
    id: 4,
    title:
      "Tech Sector Rallies on AI Optimism Despite Rate Concerns",
    excerpt:
      "Major technology stocks surge as artificial intelligence investments drive revenue growth, overshadowing interest rate headwinds.",
    category: "Stocks",
    date: "Nov 17, 2025",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    content:
      "Technology stocks posted strong gains this week as major companies reported better-than-expected quarterly results driven by artificial intelligence products and services. The rally comes despite concerns about elevated interest rates.\n\nCloud computing giants highlighted enterprise adoption of AI tools, with some reporting revenue growth exceeding analyst predictions. Semiconductor manufacturers also benefited from strong demand for AI-optimized chips.\n\nHowever, valuation concerns persist. Price-to-earnings ratios for several tech leaders now exceed historical averages, raising questions about sustainability. Some analysts warn that high expectations leave little room for disappointment.\n\nInvestment strategists recommend selectivity within the sector, favoring companies with proven AI monetization over pure-play speculative opportunities. The key question remains whether productivity gains from AI will justify current valuations.",
    views: 2341,
  },
  {
    id: 5,
    title: "Energy Stocks Gain Ground as Oil Prices Stabilize",
    excerpt:
      "Traditional energy companies and renewable players both see investor interest amid shifting global supply dynamics.",
    category: "Stocks",
    date: "Nov 16, 2025",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop",
    content:
      "Energy sector stocks advanced as crude oil prices found support near recent levels, with geopolitical factors and production decisions creating a favorable supply-demand balance.\n\nMajor integrated oil companies reported solid cash flows and maintained dividend commitments while also increasing investments in renewable energy projects. This dual strategy appeals to investors seeking both current income and long-term positioning.\n\nMeanwhile, pure-play renewable energy stocks benefited from policy support and falling technology costs. Solar and wind project developers announced new utility contracts at competitive prices.\n\nAnalysts note the sector offers diversification benefits and inflation protection. However, regulatory uncertainty and commodity price volatility remain risks. Selective exposure to both traditional and renewable energy may provide balanced positioning.",
    views: 1876,
  },
  {
    id: 6,
    title:
      "Banking Sector Faces Margin Pressure Despite Strong Loan Growth",
    excerpt:
      "Regional and national banks report solid lending volumes but compressed net interest margins as deposit costs rise.",
    category: "Stocks",
    date: "Nov 15, 2025",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&h=400&fit=crop",
    content:
      "Bank earnings this quarter revealed divergent trends: robust loan demand offset by narrowing profit margins as institutions compete for deposits in a higher rate environment.\n\nCommercial lending showed particular strength, with businesses financing expansion and inventory. Consumer credit also grew, though banks increased reserves for potential defaults as savings rates decline.\n\nThe competitive deposit environment has forced banks to raise rates on savings accounts and certificates of deposit, compressing the spread between lending and funding costs. Smaller regional banks face particular pressure.\n\nInvestors are weighing strong capital positions and dividends against margin headwinds and potential credit quality deterioration. Banks with diversified revenue streams including wealth management and investment banking may be better positioned.",
    views: 1654,
  },
  {
    id: 7,
    title:
      "Labor Market Shows Resilience as Wage Growth Moderates",
    excerpt:
      "Employment data reveals continued job creation with gradual cooling in wage inflation, offering hope for soft economic landing.",
    category: "Economics",
    date: "Nov 17, 2025",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
    content:
      "The latest employment report showed the economy added jobs at a steady pace while wage growth moderated, a combination that could satisfy both workers and inflation-conscious policymakers.\n\nUnemployment held near historic lows with broad-based job gains across sectors. Healthcare, professional services, and manufacturing all contributed to payroll growth. Labor force participation ticked higher as workers returned from the sidelines.\n\nAverage hourly earnings grew at a more sustainable pace compared to last year's elevated levels. This wage moderation, combined with productivity improvements, suggests inflation pressures may continue easing without requiring a significant employment downturn.\n\nEconomists interpret the data as consistent with a soft landing scenario. However, they caution that monetary policy effects operate with lags, and further labor market cooling may still emerge in coming months.",
    views: 2103,
  },
  {
    id: 8,
    title:
      "Consumer Spending Patterns Shift Amid Persistent Inflation",
    excerpt:
      "Retail data shows Americans adjusting purchase behaviors, favoring value options while cutting discretionary expenses.",
    category: "Economics",
    date: "Nov 16, 2025",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    content:
      "Consumer spending data reveals significant behavioral shifts as households adapt to an environment of elevated prices and higher borrowing costs.\n\nRetailers report increased traffic to discount formats and private label products as shoppers seek value. Luxury goods and discretionary categories show slower growth, while essential goods maintain stable demand.\n\nCredit card balances have risen, though delinquency rates remain manageable. Savings rates have declined from pandemic-era peaks as consumers draw down reserves. This trend raises questions about spending sustainability.\n\nThe evolving spending pattern has implications for inflation dynamics and economic growth. If consumers significantly pull back, it could accelerate disinflation but risk recession. Policymakers are monitoring these trends closely.",
    views: 1945,
  },
  {
    id: 9,
    title:
      "Housing Market Adjusts to New Interest Rate Reality",
    excerpt:
      "Home sales stabilize at lower levels as buyers and sellers adapt to elevated mortgage rates and revised price expectations.",
    category: "Economics",
    date: "Nov 14, 2025",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    content:
      "The housing market appears to be finding equilibrium after a turbulent adjustment period, with transaction volumes stabilizing albeit at reduced levels compared to recent years.\n\nMortgage rates, while lower than their peak, remain significantly elevated compared to the ultra-low pandemic era. This has reduced affordability and kept many potential sellers locked into favorable existing loans.\n\nHome prices have moderated in some markets but remain supported by limited inventory. New construction has increased but still lags demand, particularly for starter homes. First-time buyers face particular challenges balancing prices and rates.\n\nEconomists note the housing sector represents a significant portion of the economy through construction, finance, and related services. A prolonged slowdown could have broader implications, though a severe crash appears unlikely given strong household balance sheets and limited speculative excess.",
    views: 1767,
  },
  // Fox News linked articles
  {
    id: 101,
    title:
      "Speaker Johnson's spending bill faces GOP resistance",
    excerpt:
      "House Republicans express concerns over the continuing resolution ahead of government funding deadline.",
    category: "Politics",
    date: "Nov 17, 2025",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1555660258-a35b0e8e6f6d?w=600&h=400&fit=crop",
    externalLink: "https://www.foxnews.com/politics",
    isExternal: true,
    views: 892,
  },
  {
    id: 102,
    title:
      "Trump campaign strategy shifts focus to swing states",
    excerpt:
      "Former president intensifies ground game in key battleground states as primary season heats up.",
    category: "Politics",
    date: "Nov 16, 2025",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop",
    externalLink: "https://www.foxnews.com/politics",
    isExternal: true,
    views: 1156,
  },
  {
    id: 103,
    title:
      "Border security funding debate intensifies in Congress",
    excerpt:
      "Lawmakers clash over allocation of resources for border patrol and immigration enforcement.",
    category: "Politics",
    date: "Nov 15, 2025",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=600&h=400&fit=crop",
    externalLink: "https://www.foxnews.com/politics",
    isExternal: true,
    views: 743,
  },
  {
    id: 104,
    title:
      "Dow reaches new milestone as investors cheer earnings",
    excerpt:
      "Major indices surge on strong corporate results and optimistic economic outlook.",
    category: "Stocks",
    date: "Nov 17, 2025",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop",
    externalLink: "https://www.foxbusiness.com/markets",
    isExternal: true,
    views: 1634,
  },
  {
    id: 105,
    title:
      "Tesla stock jumps on production milestone announcement",
    excerpt:
      "Electric vehicle maker reports record quarterly deliveries, sending shares higher.",
    category: "Stocks",
    date: "Nov 16, 2025",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?w=600&h=400&fit=crop",
    externalLink: "https://www.foxbusiness.com/markets",
    isExternal: true,
    views: 2087,
  },
  {
    id: 106,
    title:
      "Bank earnings beat expectations despite rate concerns",
    excerpt:
      "Financial sector reports robust profits as lending activity remains strong.",
    category: "Stocks",
    date: "Nov 15, 2025",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop",
    externalLink: "https://www.foxbusiness.com/markets",
    isExternal: true,
    views: 967,
  },
  {
    id: 107,
    title: "Fed signals possible rate pause as inflation cools",
    excerpt:
      "Central bank officials hint at holding rates steady if economic data continues to improve.",
    category: "Economics",
    date: "Nov 17, 2025",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    externalLink: "https://www.foxbusiness.com/economy",
    isExternal: true,
    views: 1523,
  },
  {
    id: 108,
    title: "Jobless claims drop to lowest level in months",
    excerpt:
      "Labor market shows continued strength as unemployment applications decline.",
    category: "Economics",
    date: "Nov 16, 2025",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
    externalLink: "https://www.foxbusiness.com/economy",
    isExternal: true,
    views: 1098,
  },
  {
    id: 109,
    title:
      "Retail sales surge ahead of holiday shopping season",
    excerpt:
      "Consumer spending beats forecasts as Americans open wallets despite economic uncertainty.",
    category: "Economics",
    date: "Nov 15, 2025",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop",
    externalLink: "https://www.foxbusiness.com/economy",
    isExternal: true,
    views: 876,
  },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] =
    useState("Politics");
  const [selectedArticle, setSelectedArticle] =
    useState<any>(null);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCardNews, setShowCardNews] = useState(false);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [cardNews, setCardNews] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  // Fetch data from API on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/articles').then(r => r.json()).catch(() => null),
      fetch('/api/cardnews').then(r => r.json()).catch(() => null),
      fetch('/api/reports').then(r => r.json()).catch(() => null),
    ]).then(([fetchedArticles, fetchedCardNews, fetchedReports]) => {
      setArticles(Array.isArray(fetchedArticles) ? fetchedArticles : initialArticles);
      setCardNews(fetchedCardNews || []);
      setReports(fetchedReports || []);
      setLoading(false);
    }).catch(() => {
      setArticles(initialArticles);
      setLoading(false);
    });
  }, []);

  // Check if user is already logged in (session storage)
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isAuthenticated");
    if (loggedIn === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (password: string) => {
    setIsAuthenticated(true);
    sessionStorage.setItem("isAuthenticated", "true");
    setIsAdmin(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAuthenticated");
    setIsAdmin(false);
  };

  const handleAddArticle = async (articleData: any) => {
    const newArticle = {
      ...articleData,
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      views: 0,
    };
    setArticles(prev => [newArticle, ...prev]);
    await fetch('/api/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newArticle) }).catch(console.error);
  };

  const handleEditArticle = async (updatedArticle: any) => {
    setArticles(prev => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a));
    await fetch('/api/articles', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedArticle) }).catch(console.error);
  };

  const handleDeleteArticle = async (id: number) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    await fetch(`/api/articles?id=${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const handleBulkDeleteArticles = async (ids: number[]) => {
    setArticles(prev => prev.filter(a => !ids.includes(a.id)));
    await fetch('/api/articles', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) }).catch(console.error);
  };

  const handleAddCard = async (cardData: any) => {
    if (cardData.id) {
      // Edit existing card
      setCardNews(prev => prev.map(c => c.id === cardData.id ? cardData : c));
      await fetch('/api/cardnews', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cardData) }).catch(console.error);
    } else {
      // Add new card
      const newCard = {
        ...cardData,
        id: Date.now(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        views: 0,
      };
      setCardNews(prev => [newCard, ...prev]);
      await fetch('/api/cardnews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCard) }).catch(console.error);
    }
  };

  const handleDeleteCard = async (id: number) => {
    setCardNews(prev => prev.filter(c => c.id !== id));
    await fetch(`/api/cardnews?id=${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const handleBulkDeleteCards = async (ids: number[]) => {
    setCardNews(prev => prev.filter(c => !ids.includes(c.id)));
    await fetch('/api/cardnews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) }).catch(console.error);
  };

  const handleAddReport = async (reportData: any) => {
    const newReport = {
      ...reportData,
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setReports(prev => [newReport, ...prev]);
    await fetch('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newReport) }).catch(console.error);
  };

  const handleEditReport = async (updatedReport: any) => {
    setReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
    await fetch('/api/reports', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedReport) }).catch(console.error);
  };

  const handleDeleteReport = async (id: number) => {
    setReports(prev => prev.filter(r => r.id !== id));
    await fetch(`/api/reports?id=${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const handleBulkDeleteReports = async (ids: number[]) => {
    setReports(prev => prev.filter(r => !ids.includes(r.id)));
    await fetch('/api/reports', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) }).catch(console.error);
  };

  const handleCardClick = (card: any) => {
    const newViews = (card.views || 0) + 1;
    const updatedCards = cardNews.map(c => c.id === card.id ? { ...c, views: newViews } : c);
    setCardNews(updatedCards);
    setSelectedCard(updatedCards.find(c => c.id === card.id));
    fetch('/api/cardnews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: card.id, views: newViews }) }).catch(console.error);
  };

  const handleCardNewsClick = () => {
    setShowCardNews(true);
    setSelectedCategory("Card News");
    setSelectedArticle(null);
    setSelectedCard(null);
  };

  const handleArticleClick = (article: any) => {
    const newViews = (article.views || 0) + 1;
    // If it's an external link, open in new tab
    if (article.isExternal && article.externalLink) {
      window.open(article.externalLink, "_blank");
      // Still increment view count
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, views: newViews } : a));
      fetch('/api/articles', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: article.id, views: newViews }) }).catch(console.error);
      return;
    }

    // For regular articles, increment view count and show detail
    setArticles(prev => prev.map(a => a.id === article.id ? { ...a, views: newViews } : a));
    setSelectedArticle({ ...article, views: newViews });
    fetch('/api/articles', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: article.id, views: newViews }) }).catch(console.error);
  };

  const handleReportClick = (report: any) => {
    const newViews = (report.views || 0) + 1;
    setReports(prev => prev.map(r => r.id === report.id ? { ...r, views: newViews } : r));
    setSelectedReport({ ...report, views: newViews });
    fetch('/api/reports', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: report.id, views: newViews }) }).catch(console.error);
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setIsAdmin(true);
    } else {
      setIsAdmin(true); // This will trigger the login screen
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  // Admin Panel View - Show login if not authenticated
  if (isAdmin) {
    if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }

    return (
      <AdminPanel
        articles={articles}
        cardNews={cardNews}
        reports={reports}
        onAddArticle={handleAddArticle}
        onEditArticle={handleEditArticle}
        onDeleteArticle={handleDeleteArticle}
        onBulkDeleteArticles={handleBulkDeleteArticles}
        onAddCard={handleAddCard}
        onDeleteCard={handleDeleteCard}
        onBulkDeleteCards={handleBulkDeleteCards}
        onAddReport={handleAddReport}
        onEditReport={handleEditReport}
        onDeleteReport={handleDeleteReport}
        onBulkDeleteReports={handleBulkDeleteReports}
        onBack={() => setIsAdmin(false)}
        onLogout={handleLogout}
      />
    );
  }

  // Card News Detail View
  if (selectedCard) {
    return (
      <>
        <Navigation
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => {
            setSelectedCategory(category);
            setSelectedCard(null);
            setShowCardNews(false);
          }}
          onCardNewsClick={handleCardNewsClick}
          onAdminClick={handleAdminClick}
        />
        <CardNewsDetail
          card={selectedCard}
          onBack={() => setSelectedCard(null)}
        />
      </>
    );
  }

  // If an article is selected, show the article detail view
  if (selectedArticle) {
    return (
      <>
        <Navigation
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => {
            setSelectedCategory(category);
            setSelectedArticle(null);
            setShowCardNews(false);
          }}
          onCardNewsClick={handleCardNewsClick}
          onAdminClick={handleAdminClick}
        />
        <ArticleDetail
          article={selectedArticle}
          onBack={() => setSelectedArticle(null)}
        />
      </>
    );
  }

  // If a report is selected, show the report detail view
  if (selectedReport) {
    return (
      <>
        <Navigation
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => {
            setSelectedCategory(category);
            setSelectedReport(null);
            setShowCardNews(false);
          }}
          onCardNewsClick={handleCardNewsClick}
          onAdminClick={handleAdminClick}
        />
        <ReportDetail
          report={selectedReport}
          onBack={() => setSelectedReport(null)}
        />
      </>
    );
  }

  // Card News Grid View
  if (showCardNews) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => {
            setSelectedCategory(category);
            setShowCardNews(false);
          }}
          onCardNewsClick={handleCardNewsClick}
          onAdminClick={handleAdminClick}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-slate-900">Daily Card News</h1>
            <p className="text-slate-600">Daily visual insights on politics, stocks, and economics</p>
          </div>

          <CardNewsGrid
            cardNews={cardNews}
            onCardClick={handleCardClick}
          />
        </main>

        <footer className="bg-slate-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="mb-4">About</h3>
                <p className="text-slate-400">
                  In-depth analysis on politics, economics, and financial markets.
                </p>
              </div>
              <div>
                <h3 className="mb-4">Categories</h3>
                <ul className="space-y-2 text-slate-400">
                  <li>Daily Card News</li>
                  <li>Columns — Politics / Stocks / Economics</li>
                  <li>Reports — Company Analysis / General Report</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4">Connect</h3>
                <p className="text-slate-400 mb-3">
                  Stay updated with the latest columns and analysis.
                </p>
                <p className="text-slate-400">
                  Email Address:{" "}
                  <a href="mailto:itsautumn@snu.ac.kr" className="text-slate-200 hover:text-white transition-colors underline underline-offset-2">
                    itsautumn@snu.ac.kr
                  </a>
                </p>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
              <p>&copy; 2025 APERI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Reports View
  if (["Reports", "Company Analysis", "General Report"].includes(selectedCategory)) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation
          selectedCategory={selectedCategory}
          onCategoryChange={(category) => {
            setSelectedCategory(category);
            setShowCardNews(false);
          }}
          onCardNewsClick={handleCardNewsClick}
          onAdminClick={handleAdminClick}
        />

        <Reports
          reports={reports}
          onReportClick={handleReportClick}
          selectedCategory={selectedCategory === "Reports" ? "Company Analysis" : selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <footer className="bg-slate-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="mb-4">About</h3>
                <p className="text-slate-400">
                  In-depth analysis on politics, economics, and financial markets.
                </p>
              </div>
              <div>
                <h3 className="mb-4">Categories</h3>
                <ul className="space-y-2 text-slate-400">
                  <li>Daily Card News</li>
                  <li>Columns — Politics / Stocks / Economics</li>
                  <li>Reports — Company Analysis / General Report</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4">Connect</h3>
                <p className="text-slate-400 mb-3">
                  Stay updated with the latest columns and analysis.
                </p>
                <p className="text-slate-400">
                  Email Address:{" "}
                  <a href="mailto:itsautumn@snu.ac.kr" className="text-slate-200 hover:text-white transition-colors underline underline-offset-2">
                    itsautumn@snu.ac.kr
                  </a>
                </p>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
              <p>&copy; 2025 APERI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => {
          setSelectedCategory(category);
          setShowCardNews(false);
        }}
        onCardNewsClick={handleCardNewsClick}
        onAdminClick={handleAdminClick}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TodayCardNews
          cardNews={cardNews}
          onCardClick={handleCardClick}
        />

        <Hero
          articles={articles}
          onArticleClick={handleArticleClick}
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ArticleGrid
              selectedCategory={selectedCategory}
              onArticleClick={handleArticleClick}
              articles={articles}
            />
          </div>

          <aside className="lg:col-span-1">
            <Sidebar
              articles={articles}
              reports={reports}
              onCategoryChange={setSelectedCategory}
            />
          </aside>
        </div>
      </main>

      <footer className="bg-slate-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="mb-4">About</h3>
                <p className="text-slate-400">
                  In-depth analysis on politics, economics, and financial markets.
                </p>
              </div>
              <div>
                <h3 className="mb-4">Categories</h3>
                <ul className="space-y-2 text-slate-400">
                  <li>Daily Card News</li>
                  <li>Columns — Politics / Stocks / Economics</li>
                  <li>Reports — Company Analysis / General Report</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4">Connect</h3>
                <p className="text-slate-400 mb-3">
                  Stay updated with the latest columns and analysis.
                </p>
                <p className="text-slate-400">
                  Email Address:{" "}
                  <a href="mailto:itsautumn@snu.ac.kr" className="text-slate-200 hover:text-white transition-colors underline underline-offset-2">
                    itsautumn@snu.ac.kr
                  </a>
                </p>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
              <p>&copy; 2025 APERI. All rights reserved.</p>
            </div>
          </div>
      </footer>
    </div>
  );
}