import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, User as UserType } from "@/services/api";
import {
    Bell,
    Download,
    Loader2,
    Palette,
    Save,
    Shield,
    Trash2,
    User
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    carbonTarget: "250"
  });

  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyReports: true,
    achievements: true,
    tips: false,
    socialUpdates: true
  });

  const [preferences, setPreferences] = useState({
    darkMode: true,
    units: "metric",
    language: "English"
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
      
      setProfile({
        name: userData.name || "",
        email: userData.email || "",
        location: userData.profile?.location || "",
        carbonTarget: userData.carbonFootprint?.target?.toString() || "250"
      });

      if (userData.preferences) {
        setPreferences({
          darkMode: true, // Default to dark mode
          units: userData.preferences.units || "metric",
          language: "English"
        });

        setNotifications({
          dailyReminders: userData.preferences.notifications?.email || true,
          weeklyReports: userData.preferences.notifications?.email || true,
          achievements: userData.preferences.notifications?.push || true,
          tips: false,
          socialUpdates: userData.preferences.notifications?.push || true
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const updateData = {
        name: profile.name,
        profile: {
          ...user?.profile,
          location: profile.location
        },
        carbonFootprint: {
          ...user?.carbonFootprint,
          target: parseFloat(profile.carbonTarget)
        }
      };

      await api.updateProfile(updateData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const updateData = {
        preferences: {
          units: preferences.units,
          notifications: {
            email: notifications.dailyReminders || notifications.weeklyReports,
            push: notifications.achievements || notifications.socialUpdates
          },
          privacy: {
            shareData: true,
            publicProfile: false
          }
        }
      };

      await api.updatePreferences(updateData);
      toast.success('Preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mr-2" />
        <span className="text-slate-300">Loading settings...</span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-white mb-2">
                Settings
              </h1>
              <p className="text-emerald-300 text-lg">
                Customize your EcoTrack experience
              </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
                <TabsTrigger value="profile" className="text-white">Profile</TabsTrigger>
                <TabsTrigger value="notifications" className="text-white">Notifications</TabsTrigger>
                <TabsTrigger value="preferences" className="text-white">Preferences</TabsTrigger>
                <TabsTrigger value="data" className="text-white">Data</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <User className="w-5 h-5 text-emerald-400" />
                      <span>Profile Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <Button variant="outline" className="mb-2">Change Avatar</Button>
                        <p className="text-slate-400 text-sm">JPG, GIF or PNG. 1MB max.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled
                          className="bg-slate-700/50 border-slate-600 text-slate-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-white">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="target" className="text-white">Monthly Carbon Target (kg CO₂)</Label>
                        <Input
                          id="target"
                          type="number"
                          value={profile.carbonTarget}
                          onChange={(e) => setProfile({...profile, carbonTarget: e.target.value})}
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={saveProfile}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-blue-400" />
                      <span>Notification Preferences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl">
                        <div>
                          <h4 className="text-white font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </h4>
                          <p className="text-slate-400 text-sm">
                            {key === 'dailyReminders' && 'Get reminded to log your daily activities'}
                            {key === 'weeklyReports' && 'Receive weekly carbon footprint summaries'}
                            {key === 'achievements' && 'Notifications when you unlock achievements'}
                            {key === 'tips' && 'Eco-friendly tips and suggestions'}
                            {key === 'socialUpdates' && 'Updates from friends and community'}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          onCheckedChange={(checked) => 
                            setNotifications({...notifications, [key]: checked})
                          }
                        />
                      </div>
                    ))}
                    
                    <Button 
                      onClick={savePreferences}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Palette className="w-5 h-5 text-purple-400" />
                      <span>App Preferences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl">
                      <div>
                        <h4 className="text-white font-medium">Dark Mode</h4>
                        <p className="text-slate-400 text-sm">Use dark theme across the app</p>
                      </div>
                      <Switch
                        checked={preferences.darkMode}
                        onCheckedChange={(checked) => 
                          setPreferences({...preferences, darkMode: checked})
                        }
                      />
                    </div>

                    <div className="p-4 bg-slate-900/30 rounded-xl">
                      <h4 className="text-white font-medium mb-3">Units</h4>
                      <div className="flex space-x-4">
                        {['metric', 'imperial'].map((unit) => (
                          <button
                            key={unit}
                            onClick={() => setPreferences({...preferences, units: unit})}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              preferences.units === unit
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                          >
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={savePreferences}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Preferences
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data">
                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-red-400" />
                      <span>Data Management</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 bg-slate-900/30 rounded-xl">
                      <h4 className="text-white font-medium mb-2">Export Data</h4>
                      <p className="text-slate-400 text-sm mb-4">
                        Download all your carbon footprint data and achievements
                      </p>
                      <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>

                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                      <h4 className="text-red-400 font-medium mb-2">Danger Zone</h4>
                      <p className="text-slate-400 text-sm mb-4">
                        Permanently delete your account and all associated data
                      </p>
                      <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
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

export default Settings;
