import { ActivityTracker } from "@/components/ActivityTracker";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Activity, api } from "@/services/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Track = () => {
  const [carbonData, setCarbonData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
    target: 0
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user stats
        const statsRes = await api.getUserStats();
        setCarbonData({
          daily: statsRes.stats?.dailyFootprint ?? 0,
          weekly: statsRes.stats?.weeklyFootprint ?? 0,
          monthly: statsRes.stats?.totalFootprint ?? 0,
          target: statsRes.stats?.targetFootprint ?? 0,
        });

        // Fetch recent activities
        const activitiesRes = await api.getActivities({ limit: 10 });
        setActivities(activitiesRes.activities);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCarbonValue = (value: number, unit: string) => {
    const formattedValue = value.toFixed(1);
    const color = value > 0 ? 'text-red-400' : 'text-green-400';
    const sign = value > 0 ? '+' : '';
    return <span className={color}>{sign}{formattedValue} {unit}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mr-2" />
        <span className="text-slate-300">Loading activities...</span>
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
                Track Activities
              </h1>
              <p className="text-emerald-300 text-lg">
                Log your daily activities and monitor your carbon footprint
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <ActivityTracker setCarbonData={setCarbonData} />
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-emerald-800/30">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-slate-300">{activity.title}</span>
                        {formatCarbonValue(activity.carbonFootprint.value, activity.carbonFootprint.unit)}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400">No activities logged yet</p>
                      <p className="text-slate-500 text-sm">Start tracking your activities to see them here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Track;
