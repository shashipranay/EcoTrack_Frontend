import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Achievement, api } from "@/services/api";
import {
    Award,
    Car,
    Crown,
    Leaf,
    Loader2,
    Medal,
    Shield,
    ShoppingBag,
    Star,
    Target,
    Trophy,
    Users,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Achievements = () => {
  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [nextLevelPoints, setNextLevelPoints] = useState(100);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [availableAchievements, setAvailableAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<Array<{ rank: number; name: string; points: number; level: number }>>([]);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      // Fetch unlocked achievements
      const unlockedRes = await api.getUnlockedAchievements();
      setUnlockedAchievements(unlockedRes.achievements);

      // Fetch available achievements
      const availableRes = await api.getAvailableAchievements();
      setAvailableAchievements(availableRes.achievements);

      // Fetch achievement stats
      const statsRes = await api.getAchievementStats();
      setUserLevel(statsRes.level || 1);
      setTotalPoints(statsRes.totalPoints || 0);
      setNextLevelPoints(statsRes.nextLevelPoints || 100);

      // Mock leaderboard data (since we don't have this endpoint yet)
      setLeaderboard([
        { rank: 1, name: "Alex Green", points: 4250, level: 18 },
        { rank: 2, name: "Sarah Eco", points: 3890, level: 16 },
        { rank: 3, name: "You", points: statsRes.totalPoints || 0, level: statsRes.level || 1 },
        { rank: 4, name: "Mike Earth", points: 2100, level: 11 },
        { rank: 5, name: "Emma Nature", points: 1950, level: 10 }
      ]);

    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500";
      case "uncommon": return "bg-green-500";
      case "rare": return "bg-blue-500";
      case "epic": return "bg-purple-500";
      case "legendary": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-orange-400" />;
      default: return <span className="text-slate-400">#{rank}</span>;
    }
  };

  const getAchievementIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'transport': return Car;
      case 'energy': return Zap;
      case 'nature': return Leaf;
      case 'goals': return Target;
      case 'social': return Users;
      case 'shopping': return ShoppingBag;
      case 'tracking': return Shield;
      default: return Award;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mr-2" />
        <span className="text-slate-300">Loading achievements...</span>
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
                Achievements
              </h1>
              <p className="text-emerald-300 text-lg">
                Track your progress and unlock eco-friendly milestones
              </p>
            </div>

            {/* Player Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">Level {userLevel}</h3>
                  <p className="text-slate-400">Eco Enthusiast</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{totalPoints}</h3>
                  <p className="text-slate-400">Total Points</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-semibold">Next Level</span>
                    <span className="text-slate-400">Level {userLevel + 1}</span>
                  </div>
                  <Progress 
                    value={(totalPoints / nextLevelPoints) * 100} 
                    className="mb-2"
                  />
                  <div className="text-sm text-slate-400">
                    {nextLevelPoints - totalPoints} points to go
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="achievements" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                <TabsTrigger value="achievements" className="text-white">Achievements</TabsTrigger>
                <TabsTrigger value="leaderboard" className="text-white">Leaderboard</TabsTrigger>
              </TabsList>

              <TabsContent value="achievements" className="space-y-6">
                {/* Unlocked Achievements */}
                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Award className="w-5 h-5 text-emerald-400" />
                      <span>Unlocked Achievements ({unlockedAchievements.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {unlockedAchievements.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {unlockedAchievements.map((achievement) => {
                          const IconComponent = getAchievementIcon(achievement.category);
                          return (
                            <div key={achievement.id} className="bg-slate-700/30 rounded-lg p-4 border border-emerald-500/30">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                  <IconComponent className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold">{achievement.title}</h4>
                                  <Badge className={`${getRarityColor(achievement.rarity)} text-white text-xs`}>
                                    {achievement.rarity}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-slate-300 text-sm mb-3">{achievement.description}</p>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-emerald-400">+{achievement.points} pts</span>
                                {achievement.unlockedAt && (
                                  <span className="text-slate-400">{formatDate(achievement.unlockedAt)}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-300 mb-2">No Achievements Yet</h3>
                        <p className="text-slate-500">Start tracking your activities to unlock achievements!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Available Achievements */}
                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <span>Available Achievements ({availableAchievements.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {availableAchievements.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableAchievements.map((achievement) => {
                          const IconComponent = getAchievementIcon(achievement.category);
                          return (
                            <div key={achievement.id} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/30">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-slate-600/20 rounded-lg flex items-center justify-center">
                                  <IconComponent className="w-6 h-6 text-slate-400" />
                                </div>
                                <div>
                                  <h4 className="text-white font-semibold">{achievement.title}</h4>
                                  <Badge className={`${getRarityColor(achievement.rarity)} text-white text-xs`}>
                                    {achievement.rarity}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-slate-300 text-sm mb-3">{achievement.description}</p>
                              {achievement.progress && (
                                <div className="mb-3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-400">Progress</span>
                                    <span className="text-white">{achievement.progress.current} / {achievement.progress.required}</span>
                                  </div>
                                  <Progress value={achievement.progress.percentage} className="h-2" />
                                </div>
                              )}
                              <div className="text-sm text-slate-400">
                                +{achievement.points} pts
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-300 mb-2">All Achievements Unlocked!</h3>
                        <p className="text-slate-500">Congratulations! You've unlocked all available achievements.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard" className="space-y-6">
                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      <span>Global Leaderboard</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboard.map((player, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {getRankIcon(player.rank)}
                              <span className="text-white font-semibold">{player.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-white font-semibold">{player.points} pts</div>
                              <div className="text-slate-400 text-sm">Level {player.level}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Achievements;
