import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api, Goal } from "@/services/api";
import { Award, Calendar, Edit, Loader2, Plus, Target, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetValue: "",
    category: "Transport",
    deadline: ""
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await api.getGoals();
      setGoals(response.goals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async () => {
    if (!newGoal.title || !newGoal.description || !newGoal.targetValue) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const goalData = {
        title: newGoal.title,
        description: newGoal.description,
        targetValue: parseFloat(newGoal.targetValue),
        category: newGoal.category,
        deadline: newGoal.deadline || undefined,
      };

      await api.createGoal(goalData);
      toast.success('Goal created successfully!');
      setNewGoal({ title: "", description: "", targetValue: "", category: "Transport", deadline: "" });
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    } finally {
      setCreating(false);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      await api.deleteGoal(goalId);
      toast.success('Goal deleted successfully!');
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Transport": return "bg-blue-500";
      case "Energy": return "bg-yellow-500";
      case "Food": return "bg-green-500";
      case "Shopping": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mr-2" />
        <span className="text-slate-300">Loading goals...</span>
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
                Carbon Goals
              </h1>
              <p className="text-emerald-300 text-lg">
                Set and track your environmental goals to reduce your carbon footprint
              </p>
            </div>

            {/* Add New Goal */}
            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  <span>Create New Goal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Input
                    placeholder="Goal title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="Description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                  <Input
                    placeholder="Target value"
                    type="number"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({...newGoal, targetValue: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                    className="bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="Transport">Transport</option>
                    <option value="Energy">Energy</option>
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                  <Button 
                    onClick={addGoal} 
                    disabled={creating}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Add Goal'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.length > 0 ? (
                goals.map((goal, index) => (
                  <Card 
                    key={goal.id}
                    className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge className={`${getCategoryColor(goal.category)} text-white`}>
                          {goal.category}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-slate-400 hover:text-red-400"
                            onClick={() => deleteGoal(goal.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-white text-lg">{goal.title}</CardTitle>
                      <p className="text-slate-400 text-sm">{goal.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-white">{goal.currentValue?.toFixed(1) || 0} / {goal.targetValue} {goal.unit}</span>
                          </div>
                          <Progress 
                            value={goal.currentValue && goal.targetValue ? Math.min((goal.currentValue / goal.targetValue) * 100, 100) : 0} 
                            className="h-2"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          {goal.deadline && (
                            <div className="flex items-center space-x-1 text-slate-400">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(goal.deadline)}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1 text-emerald-400">
                            <Award className="w-4 h-4" />
                            <span>{goal.rewardPoints || 0} pts</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">No Goals Yet</h3>
                  <p className="text-slate-500">Create your first carbon reduction goal to get started!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Goals;
