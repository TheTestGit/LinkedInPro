import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Zap, Database, Download } from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    connectionRequests: true,
    campaignUpdates: true,
    weeklyReports: false,
    securityAlerts: true,
  });

  const [automation, setAutomation] = useState({
    dailyLimit: 50,
    autoFollow: true,
    smartScheduling: true,
    pauseOnWeekends: false,
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Settings</h1>
          <p className="text-text-secondary mt-1">
            Manage your account preferences and automation settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue={user?.username || ""} />
              </div>
              <Button onClick={handleSave} className="bg-linkedin hover:bg-linkedin/90">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button variant="outline">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-primary">Connection Requests</h4>
                  <p className="text-sm text-text-secondary">Get notified when someone sends you a connection request</p>
                </div>
                <Switch
                  checked={notifications.connectionRequests}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, connectionRequests: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-primary">Campaign Updates</h4>
                  <p className="text-sm text-text-secondary">Receive updates when your automation campaigns complete</p>
                </div>
                <Switch
                  checked={notifications.campaignUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, campaignUpdates: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-primary">Weekly Reports</h4>
                  <p className="text-sm text-text-secondary">Get weekly performance summaries via email</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, weeklyReports: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-primary">Security Alerts</h4>
                  <p className="text-sm text-text-secondary">Important security and account notifications</p>
                </div>
                <Switch
                  checked={notifications.securityAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, securityAlerts: checked })
                  }
                />
              </div>
              
              <Button onClick={handleSave} className="bg-linkedin hover:bg-linkedin/90">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Automation Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="daily-limit">Daily Connection Limit</Label>
                <Input 
                  id="daily-limit" 
                  type="number" 
                  value={automation.dailyLimit}
                  onChange={(e) => setAutomation({ ...automation, dailyLimit: parseInt(e.target.value) })}
                />
                <p className="text-xs text-text-secondary">
                  Maximum number of connections to send per day (recommended: 20-50)
                </p>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-primary">Auto-follow up messages</h4>
                  <p className="text-sm text-text-secondary">Automatically send follow-up messages to new connections</p>
                </div>
                <Switch
                  checked={automation.autoFollow}
                  onCheckedChange={(checked) => 
                    setAutomation({ ...automation, autoFollow: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-primary">Smart Scheduling</h4>
                  <p className="text-sm text-text-secondary">Optimize posting times based on your audience activity</p>
                </div>
                <Switch
                  checked={automation.smartScheduling}
                  onCheckedChange={(checked) => 
                    setAutomation({ ...automation, smartScheduling: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-primary">Pause on Weekends</h4>
                  <p className="text-sm text-text-secondary">Automatically pause automation campaigns on weekends</p>
                </div>
                <Switch
                  checked={automation.pauseOnWeekends}
                  onCheckedChange={(checked) => 
                    setAutomation({ ...automation, pauseOnWeekends: checked })
                  }
                />
              </div>
              
              <Button onClick={handleSave} className="bg-linkedin hover:bg-linkedin/90">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-text-primary mb-2">Export Data</h4>
                <p className="text-sm text-text-secondary mb-4">
                  Download your automation data, analytics, and connections
                </p>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-text-primary mb-2">Account Status</h4>
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-success/10 text-success">Active</Badge>
                  <span className="text-sm text-text-secondary">Premium Plan</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Your account is in good standing with no restrictions
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-destructive mb-2">Danger Zone</h4>
                <p className="text-sm text-text-secondary mb-4">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}