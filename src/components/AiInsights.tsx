
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, TrendingDown, Leaf } from "lucide-react";

export function AiInsights() {
  const insights = [
    {
      type: "recommendation",
      title: "Switch to Public Transport",
      description: "You could reduce your weekly footprint by 23% by using public transport 3 days a week.",
      impact: "High",
      savings: "19.8 kg CO₂/week",
      icon: TrendingDown,
      color: "from-emerald-500 to-green-500"
    },
    {
      type: "insight",
      title: "Peak Energy Usage",
      description: "Your electricity usage peaks between 7-9 PM. Consider shifting some activities to reduce carbon intensity.",
      impact: "Medium",
      savings: "5.2 kg CO₂/month",
      icon: Lightbulb,
      color: "from-yellow-500 to-orange-500"
    },
    {
      type: "achievement",
      title: "Plant-Based Progress",
      description: "Great job! You've reduced meat consumption by 40% this month compared to last month.",
      impact: "Low",
      savings: "12.5 kg CO₂ saved",
      icon: Leaf,
      color: "from-green-500 to-emerald-500"
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <span>AI Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index}
            className="p-4 bg-slate-900/30 rounded-xl hover:bg-slate-900/50 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${insight.color} flex-shrink-0`}>
                <insight.icon className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-semibold text-sm">{insight.title}</h4>
                  <Badge className={`${getImpactColor(insight.impact)} text-white text-xs`}>
                    {insight.impact}
                  </Badge>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed">
                  {insight.description}
                </p>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-emerald-400 text-sm font-medium">
                    {insight.savings}
                  </span>
                  <span className="text-slate-500 text-xs capitalize">
                    {insight.type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">AI Tip of the Day</span>
          </div>
          <p className="text-slate-300 text-sm">
            Small changes lead to big impacts! Your consistent tracking has improved your carbon awareness by 35% this month.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
