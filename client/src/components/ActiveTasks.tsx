import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Pause, Play, Edit3 } from "lucide-react";
import { getStatusColor } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ActiveTasks() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["/api/campaigns"],
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/campaigns/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Campaign Updated",
        description: "Campaign status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update campaign status.",
        variant: "destructive",
      });
    }
  });

  const handleStatusToggle = (campaign: any) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    updateCampaignMutation.mutate({ id: campaign.id, status: newStatus });
  };

  const activeCampaigns = campaigns?.slice(0, 3) || [];

  if (isLoading) {
    return (
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-text-primary">
            Active Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-300 rounded mb-1"></div>
                    <div className="w-24 h-3 bg-gray-300 rounded"></div>
                  </div>
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-text-primary">
          Active Tasks
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-linkedin hover:text-linkedin/80">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activeCampaigns.map((campaign: any) => (
            <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-3 h-3 ${getStatusColor(campaign.status)} rounded-full mr-3`}></div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {campaign.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {campaign.status === 'active' ? 'Running' : 
                     campaign.status === 'scheduled' ? 'Starts soon' : 
                     campaign.status} • {campaign.type} campaign
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStatusToggle(campaign)}
                  disabled={updateCampaignMutation.isPending}
                  className="p-1 h-auto"
                >
                  {campaign.status === 'active' ? (
                    <Pause className="h-4 w-4 text-text-secondary hover:text-text-primary" />
                  ) : (
                    <Play className="h-4 w-4 text-text-secondary hover:text-text-primary" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" className="p-1 h-auto">
                  <Edit3 className="h-4 w-4 text-text-secondary hover:text-text-primary" />
                </Button>
              </div>
            </div>
          ))}
          
          {activeCampaigns.length === 0 && (
            <div className="text-center py-6">
              <p className="text-text-secondary">No active campaigns</p>
              <p className="text-sm text-text-secondary mt-1">
                Create a new automation to get started
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
