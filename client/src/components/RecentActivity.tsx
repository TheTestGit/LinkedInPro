import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formatTimeAgo, getStatusTextColor } from "@/lib/utils";
import { Check, Send, Share2, Heart } from "lucide-react";

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'connection_accepted':
      return Check;
    case 'batch_connections':
      return Send;
    case 'content_shared':
      return Share2;
    case 'engagement_completed':
      return Heart;
    default:
      return Check;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'connection_accepted':
      return 'bg-success/10 text-success';
    case 'batch_connections':
      return 'bg-linkedin/10 text-linkedin';
    case 'content_shared':
      return 'bg-purple-100 text-purple-600';
    case 'engagement_completed':
      return 'bg-warning/10 text-warning';
    default:
      return 'bg-success/10 text-success';
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success':
      return 'bg-success/10 text-success hover:bg-success/20';
    case 'completed':
      return 'bg-linkedin/10 text-linkedin hover:bg-linkedin/20';
    case 'posted':
      return 'bg-purple-100 text-purple-600 hover:bg-purple-200';
    case 'engaged':
      return 'bg-warning/10 text-warning hover:bg-warning/20';
    default:
      return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  }
};

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activity"],
  });

  if (isLoading) {
    return (
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-text-primary">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="w-48 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-full h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="w-20 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-text-primary">
              Recent Activity
            </CardTitle>
            <p className="text-text-secondary text-sm mt-1">
              Latest automation results and system updates
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-linkedin hover:text-linkedin/80">
            View Full Log
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities?.map((activity: any) => {
            const Icon = getActivityIcon(activity.type);
            const iconColorClass = getActivityColor(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-10 h-10 ${iconColorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {activity.title}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-text-secondary mt-2">
                    {formatTimeAgo(activity.createdAt)}
                  </p>
                </div>
                <Badge 
                  variant="secondary"
                  className={`text-xs capitalize ${getStatusBadgeVariant(activity.status)}`}
                >
                  {activity.status}
                </Badge>
              </div>
            );
          })}
          
          {(!activities || activities.length === 0) && (
            <div className="text-center py-8">
              <p className="text-text-secondary">No recent activity</p>
              <p className="text-sm text-text-secondary mt-1">
                Start an automation to see activity here
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
