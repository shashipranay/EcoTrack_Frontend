
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, TrendingDown, Target, Calendar } from "lucide-react";

interface DashboardStatsProps {
  carbonData: {
    daily: number;
    weekly: number;
    monthly: number;
    target: number;
  };
}

export function DashboardStats({ carbonData }: DashboardStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        daily: carbonData.daily,
        weekly: carbonData.weekly,
        monthly: carbonData.monthly,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [carbonData]);

  const stats = [
    {
      title: "Today's Footprint",
      value: animatedValues.daily,
      unit: "kg CO₂",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      trend: -8.2,
    },
    {
      title: "This Week",
      value: animatedValues.weekly,
      unit: "kg CO₂",
      icon: TrendingDown,
      color: "from-emerald-500 to-green-500",
      trend: -12.5,
    },
    {
      title: "This Month",
      value: animatedValues.monthly,
      unit: "kg CO₂",
      icon: Leaf,
      color: "from-purple-500 to-pink-500",
      trend: -5.8,
    },
    {
      title: "Monthly Target",
      value: carbonData.target,
      unit: "kg CO₂",
      icon: Target,
      color: "from-orange-500 to-red-500",
      trend: 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title}
          className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.trend !== 0 && (
                <div className="flex items-center space-x-1 text-emerald-400 text-sm">
                  <TrendingDown className="w-4 h-4" />
                  <span>{Math.abs(stat.trend)}%</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-white">
                  {stat.value.toFixed(1)}
                </span>
                <span className="text-slate-400 text-sm">{stat.unit}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
