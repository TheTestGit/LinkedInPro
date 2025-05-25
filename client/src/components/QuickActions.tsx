import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QuickActions() {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Action Started",
      description: `${action} has been initiated successfully.`,
    });
  };

  const actions = [
    {
      title: "Start Connection Campaign",
      description: "Send targeted connection requests",
      icon: UserPlus,
      bgColor: "bg-linkedin/10",
      iconColor: "text-linkedin",
      hoverBorder: "hover:border-linkedin",
      hoverBg: "hover:bg-blue-50",
      action: "Connection campaign"
    },
    {
      title: "Schedule Content",
      description: "Plan your LinkedIn posts",
      icon: Calendar,
      bgColor: "bg-success/10",
      iconColor: "text-success",
      hoverBorder: "hover:border-success",
      hoverBg: "hover:bg-green-50",
      action: "Content scheduling"
    },
    {
      title: "Engage with Posts",
      description: "Auto-like and comment",
      icon: Heart,
      bgColor: "bg-warning/10",
      iconColor: "text-warning",
      hoverBorder: "hover:border-warning",
      hoverBg: "hover:bg-orange-50",
      action: "Post engagement"
    }
  ];

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-text-primary">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <Button
                key={index}
                variant="outline"
                className={`w-full justify-start p-3 h-auto border-gray-200 ${action.hoverBorder} ${action.hoverBg} transition-colors group`}
                onClick={() => handleAction(action.action)}
              >
                <div className="flex items-center w-full">
                  <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center mr-3 group-hover:opacity-80`}>
                    <Icon className={`${action.iconColor} h-5 w-5`} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-text-primary">
                      {action.title}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
