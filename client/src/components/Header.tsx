import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Plus, Bell } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/automation":
        return "Automation Campaigns";
      case "/analytics":
        return "Analytics & Insights";
      case "/connections":
        return "My Connections";
      case "/content":
        return "Content Management";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const getPageDescription = () => {
    switch (location) {
      case "/":
        return "Monitor your LinkedIn automation performance";
      case "/automation":
        return "Manage your LinkedIn automation workflows";
      case "/analytics":
        return "Track your LinkedIn automation performance and engagement metrics";
      case "/connections":
        return "Manage your LinkedIn network and connection requests";
      case "/content":
        return "Create, schedule, and manage your LinkedIn content";
      case "/settings":
        return "Manage your account preferences and automation settings";
      default:
        return "Monitor your LinkedIn automation performance";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">{getPageTitle()}</h2>
          <p className="text-text-secondary mt-1">
            {getPageDescription()}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/automation">
            <Button className="bg-linkedin hover:bg-linkedin/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Automation
            </Button>
          </Link>
          
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-warning hover:bg-warning"
              >
                3
              </Badge>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
