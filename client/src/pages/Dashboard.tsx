import StatsGrid from "@/components/StatsGrid";
import PerformanceChart from "@/components/PerformanceChart";
import QuickActions from "@/components/QuickActions";
import ActiveTasks from "@/components/ActiveTasks";
import RecentActivity from "@/components/RecentActivity";

export default function Dashboard() {
  return (
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
  );
}
