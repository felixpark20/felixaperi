import { ArrowLeft, Calendar, Clock, Share2, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const FALLBACK_COLORS = [
  "#93C5FD", "#86EFAC", "#C4B5FD", "#FDE68A",
  "#FCA5A5", "#7DD3FC", "#BBF7D0", "#FED7AA",
  "#FBCFE8", "#A5B4FC",
];

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  views?: number;
}

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

export function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  const categoryColors: Record<string, string> = {
    Politics: "bg-blue-100 text-blue-800",
    Stocks: "bg-green-100 text-green-800",
    Economics: "bg-purple-100 text-purple-800"
  };

  // Render article content - split by double newlines for paragraphs
  const renderContent = () => {
    if (article.content) {
      const paragraphs = article.content.split('\n\n');
      return paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-6 text-slate-700">
          {paragraph}
        </p>
      ));
    }
    return getArticleContent();
  };

  // Mock article content based on category (fallback for old articles)
  const getArticleContent = () => {
    if (article.category === "Politics") {
      return (
        <>
          <p className="mb-6">
            The recent electoral shifts have fundamentally altered the balance of power in Congress, 
            creating new dynamics that will shape legislative priorities for the next two years. This 
            transformation represents more than just a change in party control—it signals a broader 
            realignment in American political discourse.
          </p>
          <p className="mb-6">
            Key swing districts that flipped provide crucial insights into voter sentiment. Economic 
            concerns, particularly inflation and job security, emerged as dominant themes across 
            demographic groups. Healthcare access and education funding also resonated strongly with 
            suburban voters who proved decisive in several contested races.
          </p>
          <h3 className="mb-4 text-slate-900">Legislative Implications</h3>
          <p className="mb-6">
            With the new congressional makeup, we can expect significant shifts in committee leadership 
            and agenda-setting power. Infrastructure projects, tax policy, and regulatory frameworks 
            will all face renewed scrutiny and potential revision. The challenge for both parties will 
            be finding common ground on issues where compromise is essential.
          </p>
          <p className="mb-6">
            Foreign policy considerations add another layer of complexity. Trade agreements, defense 
            spending, and diplomatic relationships will all be subject to reexamination under the new 
            leadership structure. How Congress navigates these issues will have lasting implications 
            for America's global standing.
          </p>
        </>
      );
    } else if (article.category === "Stocks") {
      return (
        <>
          <p className="mb-6">
            Technology stocks have experienced remarkable gains over the past quarter, with major 
            indices reaching new highs. However, a closer examination of the fundamentals raises 
            important questions about whether these valuations can be sustained in the current 
            economic environment.
          </p>
          <p className="mb-6">
            Price-to-earnings ratios in the tech sector have expanded significantly, particularly 
            among AI-focused companies and cloud infrastructure providers. While innovation and 
            growth potential justify premium valuations, historical precedent suggests caution when 
            multiples extend too far beyond long-term averages.
          </p>
          <h3 className="mb-4 text-slate-900">Market Drivers and Risks</h3>
          <p className="mb-6">
            Several factors are driving the current rally. Strong earnings reports, optimistic guidance, 
            and enthusiasm around artificial intelligence applications have all contributed to investor 
            confidence. Additionally, expectations of stabilizing interest rates have reduced the 
            discount rate applied to future cash flows.
          </p>
          <p className="mb-6">
            Yet risks remain. Rising labor costs, potential regulatory headwinds, and increased 
            competition could compress margins. Investors should carefully evaluate individual 
            company fundamentals rather than assuming the entire sector will continue its upward 
            trajectory. Diversification and risk management remain essential.
          </p>
        </>
      );
    } else {
      return (
        <>
          <p className="mb-6">
            Global supply chain disruptions that began during the pandemic continue to evolve, though 
            recovery patterns vary significantly across industries and regions. Understanding these 
            dynamics is crucial for forecasting inflation trends and assessing economic growth prospects.
          </p>
          <p className="mb-6">
            Manufacturing capacity has gradually returned to pre-pandemic levels in most sectors, but 
            logistical bottlenecks persist. Port congestion has eased considerably, yet transportation 
            costs remain elevated. The shift toward nearshoring and supply chain resilience is 
            reshaping international trade patterns in fundamental ways.
          </p>
          <h3 className="mb-4 text-slate-900">Inflationary Pressures</h3>
          <p className="mb-6">
            The relationship between supply chain normalization and inflation is complex. While improved 
            goods availability should exert downward pressure on prices, structural changes in sourcing 
            strategies may maintain higher baseline costs. Services inflation, driven by wage growth 
            and strong labor markets, presents a separate challenge for central banks.
          </p>
          <p className="mb-6">
            Consumer behavior has also shifted, with spending patterns reflecting new priorities around 
            sustainability, local sourcing, and product quality. These preferences are influencing 
            corporate strategies and may have lasting effects on pricing power and profit margins 
            across various industries.
          </p>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 -ml-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
          
          <Badge className={`mb-4 ${categoryColors[article.category]}`} variant="secondary">
            {article.category}
          </Badge>
          
          <h1 className="mb-6 text-slate-900">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{article.date}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{article.readTime}</span>
              </div>
              {article.views !== undefined && (
                <>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Eye className="w-4 h-4 flex-shrink-0" />
                    <span>{article.views.toLocaleString()} views</span>
                  </div>
                </>
              )}
            </div>
            
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Featured Image */}
        <div
          className="rounded-lg overflow-hidden mb-8 h-96"
          style={{ background: FALLBACK_COLORS[article.id % FALLBACK_COLORS.length] }}
        >
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          )}
        </div>
        
        {/* Article Body */}
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-8">
            {article.excerpt}
          </p>
          
          {renderContent()}
        </div>
        
        {/* Author Bio */}
        <div className="mt-12 p-6 bg-white rounded-lg border border-slate-200">
          <div>
            <h4 className="text-slate-900 mb-2">박정규</h4>
            <p className="text-slate-600">
              서울대학교 경제학부생
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}