import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatsGrid from "@/components/StatsGrid";
import PerformanceChart from "@/components/PerformanceChart";
import QuickActions from "@/components/QuickActions";
import ActiveTasks from "@/components/ActiveTasks";
import RecentActivity from "@/components/RecentActivity";

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-linkedin-bg">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <main className="flex-1 overflow-auto">
        <Header />
        
        <div className="p-8">
          <StatsGrid />
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
            <div className="xl:col-span-2">
              <PerformanceChart />
            </div>
            
            <div className="space-y-6">
              <QuickActions />
              <ActiveTasks />
            </div>
          </div>
          
          <div className="mt-8">
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}
