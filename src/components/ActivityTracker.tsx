import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, api } from "@/services/api";
import { Car, Loader2, Plus, ShoppingBag, Utensils, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ActivityTrackerProps {
  setCarbonData: (data: { daily: number; weekly: number; monthly: number; target: number }) => void;
}

export function ActivityTracker({ setCarbonData }: ActivityTrackerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const [newActivity, setNewActivity] = useState({
    type: "transportation",
    description: "",
    amount: "",
  });

  const activityTypes = [
    { 
      value: "transportation", 
      label: "Transport", 
      icon: Car, 
      factor: 0.21,
      description: "Vehicle emissions per km"
    },
    { 
      value: "energy", 
      label: "Energy", 
      icon: Zap, 
      factor: 0.45,
      description: "Electricity consumption per kWh"
    },
    { 
      value: "food", 
      label: "Food", 
      icon: Utensils, 
      factor: 0,
      description: "Food consumption (varies by type)"
    },
    { 
      value: "shopping", 
      label: "Shopping", 
      icon: ShoppingBag, 
      factor: 0.5,
      description: "Product lifecycle emissions"
    },
  ];

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const fetchRecentActivities = async () => {
    setLoading(true);
    try {
      const response = await api.getActivities({ limit: 5 });
      setActivities(response.activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load recent activities');
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async () => {
    if (!newActivity.description || !newActivity.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    setAdding(true);
    try {
      const carbonAmount = calculateCarbonFootprint(newActivity.type, newActivity.description, parseFloat(newActivity.amount));

      const activityData = {
        category: newActivity.type,
        subcategory: newActivity.type,
        title: newActivity.description,
        description: newActivity.description,
        date: new Date().toISOString(),
        carbonFootprint: {
          value: carbonAmount,
          unit: 'kg' as const
        },
        data: {
          amount: parseFloat(newActivity.amount),
          unit: newActivity.type === 'transportation' ? 'km' : 
                newActivity.type === 'energy' ? 'kWh' : 
                newActivity.type === 'food' ? 'servings' : 'items'
        },
        isRecurring: false,
        status: 'active' as const
      };

      await api.createActivity(activityData);
      
      setNewActivity({ type: "transportation", description: "", amount: "" });
      
      // Refresh activities
      await fetchRecentActivities();

      // Update carbon data (handle negative values for carbon savings)
      setCarbonData({
        daily: Math.max(0, carbonAmount), // Don't go below 0 for display
        weekly: Math.max(0, carbonAmount),
        monthly: Math.max(0, carbonAmount),
        target: 250
      });

      if (carbonAmount < 0) {
        toast.success(`Activity added! ${Math.abs(carbonAmount).toFixed(1)} kg CO₂ saved! 🌱`);
      } else {
        toast.success(`Activity added! ${carbonAmount.toFixed(1)} kg CO₂`);
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity');
    } finally {
      setAdding(false);
    }
  };

  const calculateCarbonFootprint = (type: string, description: string, amount: number) => {
    const typeInfo = activityTypes.find(t => t.value === type);
    
    switch (type) {
      case 'food': {
        // Food carbon calculation based on type
        const foodType = description.toLowerCase();
        
        // Carbon-negative or neutral foods
        if (foodType.includes('mango') || foodType.includes('banana') || 
            foodType.includes('apple') || foodType.includes('orange') ||
            foodType.includes('vegetable') || foodType.includes('local') ||
            foodType.includes('organic') || foodType.includes('seasonal')) {
          return -0.1 * amount; // Carbon negative (good for environment)
        }
        
        // High-carbon foods
        if (foodType.includes('beef') || foodType.includes('lamb') || 
            foodType.includes('cheese') || foodType.includes('imported')) {
          return 2.5 * amount;
        }
        
        // Medium-carbon foods
        if (foodType.includes('chicken') || foodType.includes('pork') || 
            foodType.includes('fish') || foodType.includes('dairy')) {
          return 1.0 * amount;
        }
        
        // Low-carbon foods (default)
        return 0.2 * amount;
      }
        
      case 'transportation':
        return typeInfo?.factor * amount || 0;
        
      case 'energy':
        return typeInfo?.factor * amount || 0;
        
      case 'shopping':
        return typeInfo?.factor * amount || 0;
        
      default:
        return 0;
    }
  };

  const getActivityIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'transportation': return Car;
      case 'energy': return Zap;
      case 'food': return Utensils;
      case 'shopping': return ShoppingBag;
      default: return Car;
    }
  };

  const getActivityColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'transportation': return 'from-blue-500 to-blue-600';
      case 'energy': return 'from-yellow-500 to-yellow-600';
      case 'food': return 'from-green-500 to-green-600';
      case 'shopping': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Plus className="w-5 h-5 text-emerald-400" />
          <span>Track New Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Activity Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-900/50 rounded-xl">
          <div>
            <Label className="text-slate-300">Type</Label>
            <select
              value={newActivity.type}
              onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value }))}
              className="w-full mt-1 p-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {newActivity.type === 'food' && (
              <p className="text-xs text-emerald-400 mt-1">
                💡 Local, seasonal, and organic foods often have lower carbon footprints!
              </p>
            )}
          </div>
          
          <div>
            <Label className="text-slate-300">Description</Label>
            <Input
              value={newActivity.description}
              onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., Car trip to work"
              className="mt-1 bg-slate-700 border-slate-600 text-white"
            />
          </div>
          
          <div>
            <Label className="text-slate-300">Amount</Label>
            <Input
              type="number"
              value={newActivity.amount}
              onChange={(e) => setNewActivity(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="e.g., 25 km"
              className="mt-1 bg-slate-700 border-slate-600 text-white"
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={addActivity}
              disabled={adding}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
            >
              {adding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Activity'
              )}
            </Button>
          </div>
        </div>

        {/* Carbon Calculation Guide */}
        <div className="p-4 bg-slate-900/30 rounded-xl">
          <h4 className="text-white font-medium mb-3">💡 How Carbon Footprint is Calculated</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="text-emerald-400 font-medium mb-2">🌱 Good for Environment</h5>
              <ul className="text-slate-300 space-y-1">
                <li>• Local fruits (mango, apple, banana)</li>
                <li>• Seasonal vegetables</li>
                <li>• Organic produce</li>
                <li>• Plant-based foods</li>
              </ul>
            </div>
            <div>
              <h5 className="text-red-400 font-medium mb-2">⚠️ Higher Carbon Impact</h5>
              <ul className="text-slate-300 space-y-1">
                <li>• Beef and lamb</li>
                <li>• Imported foods</li>
                <li>• Processed foods</li>
                <li>• Long-distance transport</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h3 className="text-white font-semibold mb-4">Recent Activities</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mr-2" />
              <span className="text-slate-400">Loading activities...</span>
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-3">
              {activities.map((activity) => {
                const IconComponent = getActivityIcon(activity.category);
                const color = getActivityColor(activity.category);
                
                return (
                  <div 
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl hover:bg-slate-900/50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{activity.title}</p>
                        <p className="text-slate-400 text-sm capitalize">{activity.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{activity.carbonFootprint.value.toFixed(1)} kg</p>
                      <p className="text-slate-400 text-sm">CO₂</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">No activities logged yet</p>
              <p className="text-slate-600 text-sm">Start tracking your activities above</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
