import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/services/api";
import {
    AlertTriangle,
    Brain,
    Lightbulb,
    Loader2,
    RefreshCw,
    Target,
    TrendingDown,
    TrendingUp,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

interface WeeklyDataPoint {
  day: string;
  footprint: number;
  target: number;
}

interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
}

interface Insight {
  type: string;
  title: string;
  description: string;
  impact?: string;
}

interface Comparison {
  label: string;
  value: number;
  better: boolean;
}

const Insights = () => {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataPoint[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      // Fetch AI insights
      const insightsRes = await api.getInsights();
      setInsights(insightsRes.insights || []);

      // Fetch analytics data
      const analyticsRes = await api.getAnalytics();
      
      // Process weekly data
      if (analyticsRes.weeklyData) {
        setWeeklyData(analyticsRes.weeklyData.map((item: { day: string; footprint: number; target?: number }) => ({
          day: item.day,
          footprint: item.footprint,
          target: item.target || 15
        })));
      }

      // Process category data
      if (analyticsRes.categoryBreakdown) {
        const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];
        setCategoryData(analyticsRes.categoryBreakdown.map((item: { category: string; percentage: number }, index: number) => ({
          name: item.category,
          value: item.percentage,
          color: colors[index % colors.length]
        })));
      }

      // Process comparisons
      if (analyticsRes.comparisons) {
        setComparisons(analyticsRes.comparisons);
      }

    } catch (error) {
      console.error('Error fetching insights:', error);
      toast.error('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const generateNewInsights = async () => {
    setGenerating(true);
    try {
      await api.generateInsights();
      toast.success('New insights generated!');
      fetchInsights();
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate new insights');
    } finally {
      setGenerating(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return TrendingDown;
      case 'tip': return Lightbulb;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'tip': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mr-2" />
        <span className="text-slate-300">Loading insights...</span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-white mb-2">
                AI Insights
              </h1>
              <p className="text-emerald-300 text-lg">
                Discover patterns, trends, and personalized recommendations for your carbon footprint
              </p>
              <Button 
                onClick={generateNewInsights}
                disabled={generating}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate New Insights
                  </>
                )}
              </Button>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {insights.length > 0 ? (
                insights.map((insight: Insight, index: number) => {
                  const IconComponent = getInsightIcon(insight.type);
                  const color = getInsightColor(insight.type);
                  
                  return (
                    <Card 
                      key={index}
                      className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <IconComponent className={`w-6 h-6 ${color}`} />
                          <div>
                            <CardTitle className="text-white text-lg">{insight.title}</CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              {insight.impact || 'Medium'} Impact
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300">{insight.description}</p>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">No Insights Yet</h3>
                  <p className="text-slate-500">Generate AI insights to get personalized recommendations!</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Trend */}
              <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span>Weekly Footprint Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {weeklyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: 'white'
                          }} 
                        />
                        <Line type="monotone" dataKey="footprint" stroke="#10B981" strokeWidth={3} />
                        <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-slate-500">No weekly data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    <span>Footprint by Category</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.map((entry: CategoryDataPoint, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: 'white'
                            }} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {categoryData.map((item: CategoryDataPoint, index: number) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-slate-300 text-sm">{item.name}: {item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center">
                      <p className="text-slate-500">No category data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Comparisons */}
            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>How You Compare</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {comparisons.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {comparisons.map((comparison: Comparison, index: number) => (
                      <div key={index} className="text-center p-4 bg-slate-700/30 rounded-lg">
                        <h4 className="text-slate-300 font-medium mb-2">{comparison.label}</h4>
                        <div className="text-2xl font-bold text-white mb-1">{comparison.value}</div>
                        <div className={`text-sm ${comparison.better ? 'text-green-400' : 'text-red-400'}`}>
                          {comparison.better ? 'Better than average' : 'Above average'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No comparison data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Insights;
