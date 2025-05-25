import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Bot, UserPlus, TrendingUp, Share2, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsGrid() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: "Active Automations",
      value: stats?.activeAutomations || 0,
      trend: "+2 this week",
      trendUp: true,
      icon: Bot,
      bgColor: "bg-linkedin/10",
      iconColor: "text-linkedin"
    },
    {
      title: "Connections Sent", 
      value: stats?.connectionsSent || 0,
      trend: `+${stats?.connectionsToday || 0} today`,
      trendUp: true,
      icon: UserPlus,
      bgColor: "bg-success/10",
      iconColor: "text-success"
    },
    {
      title: "Response Rate",
      value: `${stats?.responseRate || 0}%`,
      trend: "-1.2% vs last week",
      trendUp: false,
      icon: TrendingUp,
      bgColor: "bg-warning/10", 
      iconColor: "text-warning"
    },
    {
      title: "Content Shared",
      value: stats?.contentShared || 0,
      trend: "+8 this month",
      trendUp: true,
      icon: Share2,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trendUp ? ArrowUp : ArrowDown;
        
        return (
          <Card key={index} className="shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">
                    {card.title}
                  </p>
                  <p className="text-2xl font-semibold text-text-primary mt-1">
                    {card.value}
                  </p>
                  <p className={`text-sm mt-1 flex items-center ${
                    card.trendUp ? 'text-success' : 'text-warning'
                  }`}>
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {card.trend}
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${card.iconColor} h-6 w-6`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
