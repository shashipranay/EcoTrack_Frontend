
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, Target, Zap, Leaf, Trophy } from "lucide-react";

export function Achievements() {
  const achievements = [
    {
      title: "Carbon Crusher",
      description: "Reduced weekly footprint by 20%",
      icon: Target,
      earned: true,
      rarity: "gold",
      progress: 100,
      reward: "250 EcoPoints"
    },
    {
      title: "Green Commuter",
      description: "Used public transport 5 times this week",
      icon: Zap,
      earned: true,
      rarity: "silver",
      progress: 100,
      reward: "150 EcoPoints"
    },
    {
      title: "Plant Pioneer",
      description: "Track 10 plant-based meals",
      icon: Leaf,
      earned: false,
      rarity: "bronze",
      progress: 70,
      reward: "100 EcoPoints"
    },
    {
      title: "Eco Champion",
      description: "Maintain target for 30 days",
      icon: Trophy,
      earned: false,
      rarity: "platinum",
      progress: 23,
      reward: "500 EcoPoints"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "platinum": return "from-purple-500 to-indigo-500";
      case "gold": return "from-yellow-500 to-orange-500";
      case "silver": return "from-gray-400 to-gray-500";
      case "bronze": return "from-orange-600 to-orange-700";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "platinum": return "bg-purple-500 text-white";
      case "gold": return "bg-yellow-500 text-black";
      case "silver": return "bg-gray-400 text-black";
      case "bronze": return "bg-orange-600 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const totalEcoPoints = achievements
    .filter(a => a.earned)
    .reduce((sum, a) => sum + parseInt(a.reward.split(' ')[0]), 0);

  return (
    <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span>Achievements</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">{totalEcoPoints} EcoPoints</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement, index) => (
          <div 
            key={index}
            className={`p-4 rounded-xl transition-all duration-200 ${
              achievement.earned 
                ? 'bg-slate-900/50 border border-emerald-500/20' 
                : 'bg-slate-900/30 opacity-75'
            } hover:bg-slate-900/60 animate-fade-in`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${getRarityColor(achievement.rarity)} flex-shrink-0 ${
                achievement.earned ? '' : 'opacity-50'
              }`}>
                <achievement.icon className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold text-sm ${
                    achievement.earned ? 'text-white' : 'text-slate-400'
                  }`}>
                    {achievement.title}
                  </h4>
                  <Badge className={`${getRarityBadge(achievement.rarity)} text-xs capitalize`}>
                    {achievement.rarity}
                  </Badge>
                </div>
                
                <p className={`text-sm ${
                  achievement.earned ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {achievement.description}
                </p>
                
                {!achievement.earned && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-emerald-400">{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-1">
                  <span className={`text-sm font-medium ${
                    achievement.earned ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {achievement.reward}
                  </span>
                  {achievement.earned && (
                    <span className="text-emerald-400 text-xs">✓ Earned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-900/20 to-green-900/20 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 font-semibold">Next Milestone</p>
              <p className="text-slate-300 text-sm">Earn 1000 EcoPoints total</p>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 font-bold">{totalEcoPoints}/1000</p>
              <p className="text-slate-400 text-xs">EcoPoints</p>
            </div>
          </div>
          <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full"
              style={{ width: `${(totalEcoPoints / 1000) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
