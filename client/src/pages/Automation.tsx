import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCampaignSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getStatusColor, getStatusTextColor } from "@/lib/utils";
import { Plus, Play, Pause, Edit, Trash2, Settings, Bot, Users, Share2, MessageSquare } from "lucide-react";
import { z } from "zod";

const campaignFormSchema = insertCampaignSchema.extend({
  dailyLimit: z.number().min(1).max(100).optional(),
  targetRole: z.string().optional(),
  messageTemplate: z.string().optional(),
  likesPerDay: z.number().min(1).max(200).optional(),
  commentsPerDay: z.number().min(1).max(50).optional(),
});

type CampaignFormData = z.infer<typeof campaignFormSchema>;

const campaignTypes = [
  { value: "connection", label: "Connection Requests", icon: Users, description: "Send targeted connection requests" },
  { value: "message", label: "Follow-up Messages", icon: MessageSquare, description: "Send messages to new connections" },
  { value: "engagement", label: "Content Engagement", icon: Share2, description: "Like and comment on posts automatically" },
  { value: "content", label: "Content Sharing", icon: Bot, description: "Share curated content to your timeline" },
];

function EditCampaignDialog({ campaign, onSuccess }: { campaign?: any, onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: campaign?.name || "",
      type: campaign?.type || "",
      status: campaign?.status || "active",
      dailyLimit: campaign?.settings?.dailyLimit || 25,
      targetRole: campaign?.settings?.targetRole || "",
      messageTemplate: campaign?.settings?.messageTemplate || "",
      likesPerDay: campaign?.settings?.likesPerDay || 50,
      commentsPerDay: campaign?.settings?.commentsPerDay || 10,
    },
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async (data: CampaignFormData) => {
      const { dailyLimit, targetRole, messageTemplate, likesPerDay, commentsPerDay, ...campaignData } = data;
      
      const settings: any = {};
      if (dailyLimit) settings.dailyLimit = dailyLimit;
      if (targetRole) settings.targetRole = targetRole;
      if (messageTemplate) settings.messageTemplate = messageTemplate;
      if (likesPerDay) settings.likesPerDay = likesPerDay;
      if (commentsPerDay) settings.commentsPerDay = commentsPerDay;

      const response = await apiRequest("PATCH", `/api/campaigns/${campaign.id}`, {
        ...campaignData,
        settings,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Campaign Updated",
        description: "Your automation campaign has been updated successfully.",
      });
      setOpen(false);
      form.reset();
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update automation campaign.",
        variant: "destructive",
      });
    },
  });

  const selectedType = form.watch("type");

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-text-primary">
              Edit Campaign: {campaign?.name}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => updateCampaignMutation.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sales Outreach Q1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic settings based on type */}
              {selectedType === "connection" && (
                <>
                  <FormField
                    control={form.control}
                    name="dailyLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Connection Limit</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="25" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Software Engineer, Marketing Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {selectedType === "message" && (
                <FormField
                  control={form.control}
                  name="messageTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Template</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Hi {name}, thanks for connecting!"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {selectedType === "engagement" && (
                <>
                  <FormField
                    control={form.control}
                    name="likesPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Likes Per Day</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="50" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="commentsPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comments Per Day</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="10" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateCampaignMutation.isPending}
                  className="bg-linkedin hover:bg-linkedin/90"
                >
                  {updateCampaignMutation.isPending ? "Updating..." : "Update Campaign"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CampaignSettingsDialog({ campaign, onSuccess }: { campaign?: any, onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    autoSchedule: campaign?.settings?.autoSchedule || false,
    smartTiming: campaign?.settings?.smartTiming || true,
    skipWeekends: campaign?.settings?.skipWeekends || true,
    maxConnections: campaign?.settings?.maxConnections || 100,
    cooldownHours: campaign?.settings?.cooldownHours || 24,
    enableNotifications: campaign?.settings?.enableNotifications || true,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      const response = await apiRequest("PATCH", `/api/campaigns/${campaign.id}`, {
        settings: { ...campaign.settings, ...newSettings },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Settings Updated",
        description: "Campaign settings have been saved successfully.",
      });
      setOpen(false);
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update campaign settings.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Settings className="h-4 w-4" />
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-text-primary">
              Campaign Settings: {campaign?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-text-primary">Automation Rules</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Schedule</Label>
                  <p className="text-xs text-text-secondary">Automatically schedule campaign actions</p>
                </div>
                <Switch
                  checked={settings.autoSchedule}
                  onCheckedChange={(checked) => setSettings({...settings, autoSchedule: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Smart Timing</Label>
                  <p className="text-xs text-text-secondary">Optimize timing based on user activity</p>
                </div>
                <Switch
                  checked={settings.smartTiming}
                  onCheckedChange={(checked) => setSettings({...settings, smartTiming: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Skip Weekends</Label>
                  <p className="text-xs text-text-secondary">Pause automation on weekends</p>
                </div>
                <Switch
                  checked={settings.skipWeekends}
                  onCheckedChange={(checked) => setSettings({...settings, skipWeekends: checked})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-text-primary">Limits & Safety</h4>
              
              <div className="space-y-2">
                <Label>Maximum Daily Connections</Label>
                <Input
                  type="number"
                  value={settings.maxConnections}
                  onChange={(e) => setSettings({...settings, maxConnections: parseInt(e.target.value) || 0})}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Cooldown Period (hours)</Label>
                <Input
                  type="number"
                  value={settings.cooldownHours}
                  onChange={(e) => setSettings({...settings, cooldownHours: parseInt(e.target.value) || 0})}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-text-primary">Notifications</h4>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-xs text-text-secondary">Get updates about campaign progress</p>
                </div>
                <Switch
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={updateSettingsMutation.isPending}
                className="bg-linkedin hover:bg-linkedin/90"
              >
                {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CreateAutomationDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: "",
      type: "",
      status: "active",
      dailyLimit: 25,
      targetRole: "",
      messageTemplate: "",
      likesPerDay: 50,
      commentsPerDay: 10,
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: CampaignFormData) => {
      const { dailyLimit, targetRole, messageTemplate, likesPerDay, commentsPerDay, ...campaignData } = data;
      
      const settings: any = {};
      if (dailyLimit) settings.dailyLimit = dailyLimit;
      if (targetRole) settings.targetRole = targetRole;
      if (messageTemplate) settings.messageTemplate = messageTemplate;
      if (likesPerDay) settings.likesPerDay = likesPerDay;
      if (commentsPerDay) settings.commentsPerDay = commentsPerDay;

      const response = await apiRequest("POST", "/api/campaigns", {
        ...campaignData,
        settings,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Automation Created",
        description: "Your new automation campaign has been created successfully.",
      });
      setOpen(false);
      form.reset();
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create automation campaign.",
        variant: "destructive",
      });
    },
  });

  const selectedType = form.watch("type");
  const selectedCampaignType = campaignTypes.find(t => t.value === selectedType);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-linkedin hover:bg-linkedin/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Automation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary">
            Create New Automation
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createCampaignMutation.mutate(data))} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sales Outreach Q1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Automation Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select automation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {campaignTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center">
                              <Icon className="h-4 w-4 mr-2" />
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-text-secondary">{type.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dynamic settings based on type */}
            {selectedType === "connection" && (
              <>
                <FormField
                  control={form.control}
                  name="dailyLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Connection Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="25" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Role (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineer, Marketing Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {selectedType === "message" && (
              <FormField
                control={form.control}
                name="messageTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Template</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Hi {name}, thanks for connecting! I'd love to learn more about your work at {company}."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedType === "engagement" && (
              <>
                <FormField
                  control={form.control}
                  name="likesPerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Likes Per Day</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="50" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commentsPerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments Per Day</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="10" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createCampaignMutation.isPending}
                className="bg-linkedin hover:bg-linkedin/90"
              >
                {createCampaignMutation.isPending ? "Creating..." : "Create Automation"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function Automation() {
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
  });

  const handleStatusToggle = (campaign: any) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    updateCampaignMutation.mutate({ id: campaign.id, status: newStatus });
  };

  const getCampaignIcon = (type: string) => {
    const campaignType = campaignTypes.find(t => t.value === type);
    return campaignType?.icon || Bot;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Automation Campaigns</h1>
          <p className="text-text-secondary mt-1">
            Manage your LinkedIn automation workflows
          </p>
        </div>
        <CreateAutomationDialog onSuccess={() => {}} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns?.map((campaign: any) => {
            const Icon = getCampaignIcon(campaign.type);
            const statusColor = getStatusColor(campaign.status);
            const statusTextColor = getStatusTextColor(campaign.status);
            
            return (
              <Card key={campaign.id} className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-linkedin/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-linkedin" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-text-primary">
                          {campaign.name}
                        </CardTitle>
                        <p className="text-sm text-text-secondary capitalize">
                          {campaign.type} campaign
                        </p>
                      </div>
                    </div>
                    <Badge className={`${statusColor} text-white hover:${statusColor}/80`}>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {campaign.settings && (
                      <div className="text-sm text-text-secondary">
                        {campaign.settings.dailyLimit && (
                          <p>Daily Limit: {campaign.settings.dailyLimit}</p>
                        )}
                        {campaign.settings.targetRole && (
                          <p>Target: {campaign.settings.targetRole}</p>
                        )}
                        {campaign.settings.likesPerDay && (
                          <p>Likes: {campaign.settings.likesPerDay}/day</p>
                        )}
                        {campaign.settings.commentsPerDay && (
                          <p>Comments: {campaign.settings.commentsPerDay}/day</p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusToggle(campaign)}
                          disabled={updateCampaignMutation.isPending}
                        >
                          {campaign.status === 'active' ? (
                            <Pause className="h-4 w-4 mr-1" />
                          ) : (
                            <Play className="h-4 w-4 mr-1" />
                          )}
                          {campaign.status === 'active' ? 'Pause' : 'Start'}
                        </Button>
                        
                        <EditCampaignDialog 
                          campaign={campaign} 
                          onSuccess={() => {
                            // Refresh campaigns list
                          }} 
                        />
                      </div>
                      
                      <CampaignSettingsDialog 
                        campaign={campaign} 
                        onSuccess={() => {
                          // Refresh campaigns list
                        }} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {(!campaigns || campaigns.length === 0) && (
            <div className="col-span-full text-center py-12">
              <Bot className="h-12 w-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No Automations Yet</h3>
              <p className="text-text-secondary mb-6">
                Create your first automation campaign to get started with LinkedIn automation
              </p>
              <CreateAutomationDialog onSuccess={() => {}} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}