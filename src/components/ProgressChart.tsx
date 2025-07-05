import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ProgressChartProps {
  carbonData: {
    daily: number;
    weekly: number;
    monthly: number;
    target: number;
  };
}

export function ProgressChart({ carbonData }: ProgressChartProps) {
  const weeklyData = [
    { day: "Mon", footprint: 15.2, target: 12 },
    { day: "Tue", footprint: 11.8, target: 12 },
    { day: "Wed", footprint: 9.5, target: 12 },
    { day: "Thu", footprint: 13.1, target: 12 },
    { day: "Fri", footprint: 14.7, target: 12 },
    { day: "Sat", footprint: 8.3, target: 12 },
    { day: "Sun", footprint: carbonData.daily, target: 12 },
  ];

  const monthlyProgress = [
    { week: "Week 1", footprint: 98.5, target: 85 },
    { week: "Week 2", footprint: 87.2, target: 85 },
    { week: "Week 3", footprint: 79.8, target: 85 },
    { week: "Week 4", footprint: carbonData.weekly, target: 85 },
  ];

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length > 0) {
      const footprintValue = payload[0]?.value;
      const targetValue = payload[1]?.value;
      
      return (
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {footprintValue !== undefined && (
            <p className="text-emerald-400">
              Footprint: {footprintValue.toFixed(1)} kg CO₂
            </p>
          )}
          {targetValue !== undefined && (
            <p className="text-orange-400">
              Target: {targetValue} kg CO₂
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <TrendingDown className="w-5 h-5 text-emerald-400" />
          <span>Progress Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Chart */}
        <div>
          <h3 className="text-white font-semibold mb-4">Weekly Footprint</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="footprintGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="day" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="footprint"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#footprintGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Progress */}
        <div>
          <h3 className="text-white font-semibold mb-4">Monthly Progress</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="week" 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="footprint"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/30 rounded-xl">
            <p className="text-slate-400 text-sm">Week Progress</p>
            <p className="text-2xl font-bold text-white">
              {carbonData.target > 0 ? ((carbonData.target - carbonData.weekly) / carbonData.target * 100).toFixed(1) : '0.0'}%
            </p>
            <p className="text-emerald-400 text-sm">Below target</p>
          </div>
          <div className="p-4 bg-slate-900/30 rounded-xl">
            <p className="text-slate-400 text-sm">Monthly Progress</p>
            <p className="text-2xl font-bold text-white">
              {carbonData.target > 0 ? ((carbonData.target - carbonData.monthly) / carbonData.target * 100).toFixed(1) : '0.0'}%
            </p>
            <p className="text-emerald-400 text-sm">Improvement</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
