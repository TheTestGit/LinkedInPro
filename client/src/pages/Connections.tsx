import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, UserPlus, MessageSquare, MoreHorizontal } from "lucide-react";

// Sample connection data - in a real app this would come from your database
const sampleConnections = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Marketing Director",
    company: "TechCorp",
    location: "San Francisco, CA",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    connectionDate: "2025-01-20",
    status: "connected",
    mutualConnections: 12,
    lastMessage: "Thanks for connecting! I'd love to discuss your marketing automation strategies."
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Software Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    connectionDate: "2025-01-18",
    status: "connected",
    mutualConnections: 8,
    lastMessage: null
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Product Manager",
    company: "InnovateLabs",
    location: "Austin, TX",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    connectionDate: "2025-01-15",
    status: "pending",
    mutualConnections: 5,
    lastMessage: null
  },
];

const pendingRequests = [
  {
    id: 4,
    name: "David Kim",
    title: "VP of Sales",
    company: "GrowthCo",
    location: "Chicago, IL",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    requestDate: "2025-01-22",
    status: "pending_sent",
    mutualConnections: 15
  },
  {
    id: 5,
    name: "Lisa Wang",
    title: "HR Director",
    company: "PeopleFirst",
    location: "Seattle, WA",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    requestDate: "2025-01-21",
    status: "pending_sent",
    mutualConnections: 7
  }
];

export default function Connections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredConnections = sampleConnections.filter(connection =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Connected</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Pending</Badge>;
      case "pending_sent":
        return <Badge className="bg-linkedin/10 text-linkedin hover:bg-linkedin/20">Request Sent</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const ConnectionCard = ({ connection, showActions = true }: { connection: any, showActions?: boolean }) => (
    <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={connection.avatar} alt={connection.name} />
              <AvatarFallback className="bg-linkedin text-white">
                {connection.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h3 className="font-semibold text-text-primary">{connection.name}</h3>
              <p className="text-text-secondary text-sm">{connection.title}</p>
              <p className="text-text-secondary text-sm">{connection.company}</p>
              <p className="text-text-secondary text-xs mt-1">{connection.location}</p>
              
              <div className="flex items-center space-x-4 mt-3">
                {getStatusBadge(connection.status)}
                <span className="text-xs text-text-secondary">
                  {connection.mutualConnections} mutual connections
                </span>
              </div>
              
              {connection.lastMessage && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-text-secondary">
                    "{connection.lastMessage}"
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">My Connections</h1>
          <p className="text-text-secondary mt-1">
            Manage your LinkedIn network and connection requests
          </p>
        </div>
        
        <Button className="bg-linkedin hover:bg-linkedin/90 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Find Connections
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
          <Input
            placeholder="Search connections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all">All Connections</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredConnections.map((connection) => (
              <ConnectionCard key={connection.id} connection={connection} />
            ))}
            
            {filteredConnections.length === 0 && (
              <Card className="shadow-sm border-gray-200">
                <CardContent className="p-12 text-center">
                  <UserPlus className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No connections found</h3>
                  <p className="text-text-secondary">
                    Try adjusting your search terms or start building your network
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {sampleConnections
              .filter(c => c.status === "connected")
              .slice(0, 3)
              .map((connection) => (
                <ConnectionCard key={connection.id} connection={connection} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Sent Requests</h3>
            <div className="grid grid-cols-1 gap-4">
              {pendingRequests.map((request) => (
                <ConnectionCard key={request.id} connection={request} showActions={false} />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Received Requests</h3>
            <div className="grid grid-cols-1 gap-4">
              {sampleConnections
                .filter(c => c.status === "pending")
                .map((connection) => (
                  <Card key={connection.id} className="shadow-sm border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={connection.avatar} alt={connection.name} />
                            <AvatarFallback className="bg-linkedin text-white">
                              {connection.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-text-primary">{connection.name}</h3>
                            <p className="text-text-secondary text-sm">{connection.title}</p>
                            <p className="text-text-secondary text-sm">{connection.company}</p>
                            <p className="text-text-secondary text-xs mt-1">
                              {connection.mutualConnections} mutual connections
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="bg-linkedin hover:bg-linkedin/90">
                            Accept
                          </Button>
                          <Button variant="outline" size="sm">
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}