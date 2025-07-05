import {
    Sidebar as SidebarComponent,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { api, User } from "@/services/api";
import {
    Activity,
    Award,
    BarChart3,
    Home,
    Leaf,
    LogIn,
    LogOut,
    Settings,
    Target,
    TrendingUp,
    UserPlus
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Track Activities",
    url: "/track",
    icon: Activity,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Goals",
    url: "/goals",
    icon: Target,
  },
  {
    title: "Insights",
    url: "/insights",
    icon: TrendingUp,
  },
  {
    title: "Achievements",
    url: "/achievements",
    icon: Award,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const authItems = [
  {
    title: "Login",
    url: "/login",
    icon: LogIn,
  },
  {
    title: "Sign Up",
    url: "/signup",
    icon: UserPlus,
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Still clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const isAuthenticated = !!user;
  
  return (
    <SidebarComponent className="border-r-0 bg-slate-50 dark:bg-slate-900 shadow-lg">
      <SidebarHeader className="p-6 border-b border-slate-200 dark:border-slate-700">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-105">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">EcoTrack</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 opacity-80">AI Carbon Tracker</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4 bg-slate-50 dark:bg-slate-900">
        {isAuthenticated && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-600 dark:text-slate-400 text-xs font-semibold px-4 mb-3 uppercase tracking-wider">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={location.pathname === item.url}
                      className="group relative overflow-hidden rounded-xl mx-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-300 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-600/30 data-[active=true]:bg-emerald-100 dark:data-[active=true]:bg-emerald-900/50 data-[active=true]:text-emerald-800 dark:data-[active=true]:text-emerald-200 data-[active=true]:border-emerald-300 dark:data-[active=true]:border-emerald-500/50"
                    >
                      <Link to={item.url} className="flex items-center space-x-3 p-3">
                        <div className="relative">
                          <item.icon className="w-5 h-5 z-10 relative group-hover:scale-110 transition-transform duration-200" />
                          <div className="absolute inset-0 bg-emerald-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 blur-sm"></div>
                        </div>
                        <span className="font-medium">{item.title}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {!isAuthenticated && (
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-slate-600 dark:text-slate-400 text-xs font-semibold px-4 mb-3 uppercase tracking-wider">
              Account
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {authItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={location.pathname === item.url}
                      className="group relative overflow-hidden rounded-xl mx-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 border border-transparent hover:border-blue-200 dark:hover:border-blue-600/30 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-900/50 data-[active=true]:text-blue-800 dark:data-[active=true]:text-blue-200 data-[active=true]:border-blue-300 dark:data-[active=true]:border-blue-500/50"
                    >
                      <Link to={item.url} className="flex items-center space-x-3 p-3">
                        <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {isAuthenticated && (
        <SidebarFooter className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/40 dark:to-green-900/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-600/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white text-sm font-medium truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 text-xs opacity-80">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </SidebarFooter>
      )}
    </SidebarComponent>
  );
}
