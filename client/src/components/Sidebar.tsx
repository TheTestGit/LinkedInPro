import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, 
  Bot, 
  Users, 
  Share2, 
  TrendingUp, 
  Settings, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { SiLinkedin } from "react-icons/si";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3, section: "main" },
  { name: "Automation", href: "/automation", icon: Bot, section: "main" },
  { name: "Connections", href: "/connections", icon: Users, section: "main" },
  { name: "Content", href: "/content", icon: Share2, section: "main" },
  { name: "Analytics", href: "/analytics", icon: TrendingUp, section: "main" },
  { name: "Settings", href: "/settings", icon: Settings, section: "account" },
  { name: "Support", href: "/support", icon: HelpCircle, section: "account" },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();
  
  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const mainNavItems = navigation.filter(item => item.section === "main");
  const accountNavItems = navigation.filter(item => item.section === "account");

  return (
    <aside className={cn(
      "bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linkedin rounded-lg flex items-center justify-center">
              <SiLinkedin className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-text-primary">LinkedPro</h1>
              <p className="text-sm text-text-secondary">Automation Suite</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-2"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        {!collapsed && (
          <div className="px-6 mb-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Main
            </h3>
          </div>
        )}
        
        <ul className="space-y-1 px-3">
          {mainNavItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start px-3 py-2 h-auto",
                      isActive 
                        ? "text-linkedin bg-blue-50 hover:bg-blue-100" 
                        : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                    {!collapsed && <span>{item.name}</span>}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>

        {!collapsed && (
          <div className="px-6 mt-8 mb-4">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Account
            </h3>
          </div>
        )}
        
        <ul className="space-y-1 px-3">
          {accountNavItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start px-3 py-2 h-auto",
                      isActive 
                        ? "text-linkedin bg-blue-50 hover:bg-blue-100" 
                        : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                    {!collapsed && <span>{item.name}</span>}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-linkedin text-white">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user?.name || 'Loading...'}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {user?.email || ''}
              </p>
            </div>
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="p-1">
                <Settings className="h-4 w-4 text-text-secondary" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
