import { Achievements } from "@/components/Achievements";
import { ActivityTracker } from "@/components/ActivityTracker";
import { AiInsights } from "@/components/AiInsights";
import { DashboardStats } from "@/components/DashboardStats";
import { ProgressChart } from "@/components/ProgressChart";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [carbonData, setCarbonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getUserStats();
        // Adapt backend stats to carbonData shape
        setCarbonData({
          daily: res.stats?.dailyFootprint ?? 0,
          weekly: res.stats?.weeklyFootprint ?? 0,
          monthly: res.stats?.totalFootprint ?? 0,
          target: res.stats?.targetFootprint ?? 0,
          ...res.stats
        });
      } catch (err: any) {
        setError(err.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mr-2" />
        <span className="text-slate-300">Loading your dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <span className="text-red-400 font-semibold">{error}</span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-white mb-2">
                Dashboard
              </h1>
              <p className="text-emerald-300 text-lg">
                Track your carbon footprint and environmental impact
              </p>
            </div>

            {/* Stats Overview */}
            <DashboardStats carbonData={carbonData} />

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <ActivityTracker setCarbonData={setCarbonData} />
                <ProgressChart carbonData={carbonData} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <AiInsights />
                <Achievements />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
