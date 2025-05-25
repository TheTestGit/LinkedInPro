import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link, useLocation } from "wouter";
import { Plus, Bell, CheckCircle, AlertCircle, Clock } from "lucide-react";



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
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-warning hover:bg-warning"
                  >
                    2
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-text-primary">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 border-b bg-blue-50">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">Campaign Started</p>
                        <p className="text-sm text-text-secondary">Your 'Sales Outreach' campaign is now active</p>
                        <p className="text-xs text-text-secondary mt-1">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b bg-blue-50">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">Daily Limit Reached</p>
                        <p className="text-sm text-text-secondary">Connection requests limit reached for today</p>
                        <p className="text-xs text-text-secondary mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-4 w-4 text-blue-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">Weekly Report Ready</p>
                        <p className="text-sm text-text-secondary">Your LinkedIn automation report is available</p>
                        <p className="text-xs text-text-secondary mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <Button variant="ghost" className="w-full text-sm">
                    View All Notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}
