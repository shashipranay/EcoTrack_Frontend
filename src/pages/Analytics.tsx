import { ProgressChart } from "@/components/ProgressChart";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [carbonData, setCarbonData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    target: 0
  });
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<Array<{ category: string; value: number }>>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch user stats
      const statsRes = await api.getUserStats();
      setCarbonData({
        daily: statsRes.stats?.dailyFootprint ?? 0,
        weekly: statsRes.stats?.weeklyFootprint ?? 0,
        monthly: statsRes.stats?.totalFootprint ?? 0,
        target: statsRes.stats?.targetFootprint ?? 0,
      });

      // Fetch analytics data
      const analyticsRes = await api.getAnalytics();
      if (analyticsRes.categoryBreakdown && Array.isArray(analyticsRes.categoryBreakdown)) {
        setMonthlyBreakdown(analyticsRes.categoryBreakdown);
      } else {
        setMonthlyBreakdown([]);
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
      // Set default values on error
      setCarbonData({
        daily: 0,
        weekly: 0,
        monthly: 0,
        target: 250
      });
      setMonthlyBreakdown([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mr-2" />
        <span className="text-slate-300">Loading analytics...</span>
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
                Analytics
              </h1>
              <p className="text-emerald-300 text-lg">
                Detailed insights into your carbon footprint trends
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <ProgressChart carbonData={carbonData} />
              
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-emerald-800/30">
                <h3 className="text-xl font-semibold text-white mb-4">Monthly Breakdown</h3>
                {monthlyBreakdown.length > 0 ? (
                  <div className="space-y-4">
                    {monthlyBreakdown.map((category, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-slate-300">{category.category || 'Unknown'}</span>
                        <span className="text-white font-semibold">
                          {(category.value || 0).toFixed(1)} kg CO₂
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No category data available</p>
                    <p className="text-slate-600 text-sm">Start tracking activities to see your breakdown</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
