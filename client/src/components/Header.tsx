import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Dashboard</h2>
          <p className="text-text-secondary mt-1">
            Monitor your LinkedIn automation performance
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button className="bg-linkedin hover:bg-linkedin/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Automation
          </Button>
          
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
