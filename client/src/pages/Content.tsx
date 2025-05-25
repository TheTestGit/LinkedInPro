import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, Share2, Edit, Trash2, Clock, CheckCircle, Send } from "lucide-react";

// Sample content data
const scheduledPosts = [
  {
    id: 1,
    content: "🚀 Excited to share insights from our latest product development sprint. The power of automation in modern workflows cannot be overstated! #ProductManagement #Automation",
    scheduledFor: "2025-01-25T10:00:00Z",
    status: "scheduled",
    type: "text",
    engagement: { likes: 0, comments: 0, shares: 0 }
  },
  {
    id: 2,
    content: "Just wrapped up an amazing week at TechConf 2025! Key takeaway: AI and human collaboration is the future of work. What's your experience with AI tools? #TechConf #AI",
    scheduledFor: "2025-01-24T14:30:00Z",
    status: "scheduled",
    type: "text",
    engagement: { likes: 0, comments: 0, shares: 0 }
  }
];

const publishedPosts = [
  {
    id: 3,
    content: "5 key strategies that transformed our LinkedIn automation approach this quarter. Swipe to see the results! 📈 #LinkedInMarketing #GrowthHacking",
    publishedAt: "2025-01-20T09:00:00Z",
    status: "published",
    type: "carousel",
    engagement: { likes: 47, comments: 8, shares: 12 }
  },
  {
    id: 4,
    content: "Grateful for the amazing connections I've made through authentic networking. Building relationships > collecting contacts. What's your networking philosophy?",
    publishedAt: "2025-01-18T16:15:00Z",
    status: "published",
    type: "text",
    engagement: { likes: 92, comments: 23, shares: 6 }
  }
];

interface ContentFormData {
  content: string;
  scheduledFor: string;
  type: string;
}

function CreateContentDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContentFormData>({
    defaultValues: {
      content: "",
      scheduledFor: "",
      type: "text",
    },
  });

  const onSubmit = async (data: ContentFormData) => {
    try {
      const scheduledDate = new Date(data.scheduledFor);
      const now = new Date();
      
      if (scheduledDate <= now) {
        toast({
          title: "Invalid Date",
          description: "Please select a future date and time.",
          variant: "destructive",
        });
        return;
      }

      // Simulate content creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Content Scheduled",
        description: `Your ${data.type} post has been scheduled for ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString()}.`,
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule content. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-linkedin hover:bg-linkedin/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary">
            Create New Post
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="text">Text Post</SelectItem>
                      <SelectItem value="image">Image Post</SelectItem>
                      <SelectItem value="video">Video Post</SelectItem>
                      <SelectItem value="carousel">Carousel Post</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your thoughts, insights, or updates..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-text-secondary">
                    {field.value?.length || 0}/3000 characters
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduledFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule For (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-linkedin hover:bg-linkedin/90">
                {form.watch("scheduledFor") ? "Schedule Post" : "Post Now"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function PostCard({ post, isScheduled = false }: { post: any, isScheduled?: boolean }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">Scheduled</Badge>;
      case "published":
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Published</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getStatusBadge(post.status)}
            <Badge variant="outline" className="capitalize">
              {post.type}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-text-primary leading-relaxed">
            {post.content}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center space-x-4">
            {isScheduled ? (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Scheduled for {formatDate(post.scheduledFor)}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>Published {formatDate(post.publishedAt)}</span>
              </div>
            )}
          </div>

          {!isScheduled && (
            <div className="flex items-center space-x-4">
              <span>{post.engagement.likes} likes</span>
              <span>{post.engagement.comments} comments</span>
              <span>{post.engagement.shares} shares</span>
            </div>
          )}
        </div>

        {isScheduled && (
          <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
            <Button size="sm" variant="outline">
              <Send className="h-4 w-4 mr-1" />
              Post Now
            </Button>
            <Button size="sm" variant="outline">
              Reschedule
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Content() {
  const [activeTab, setActiveTab] = useState("scheduled");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Content Management</h1>
          <p className="text-text-secondary mt-1">
            Create, schedule, and manage your LinkedIn content
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Content Calendar
          </Button>
          <CreateContentDialog />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Scheduled Posts</p>
                <p className="text-2xl font-semibold text-text-primary mt-1">
                  {scheduledPosts.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Published This Month</p>
                <p className="text-2xl font-semibold text-text-primary mt-1">
                  {publishedPosts.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Total Engagement</p>
                <p className="text-2xl font-semibold text-text-primary mt-1">
                  {publishedPosts.reduce((sum, post) => 
                    sum + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-linkedin/10 rounded-lg flex items-center justify-center">
                <Share2 className="h-6 w-6 text-linkedin" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm font-medium">Avg. Engagement Rate</p>
                <p className="text-2xl font-semibold text-text-primary mt-1">
                  8.4%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Share2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {scheduledPosts.map((post) => (
              <PostCard key={post.id} post={post} isScheduled={true} />
            ))}
            
            {scheduledPosts.length === 0 && (
              <Card className="shadow-sm border-gray-200">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No scheduled posts</h3>
                  <p className="text-text-secondary mb-6">
                    Create and schedule your first post to maintain consistent engagement
                  </p>
                  <CreateContentDialog />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {publishedPosts.map((post) => (
              <PostCard key={post.id} post={post} isScheduled={false} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-12 text-center">
              <Edit className="h-12 w-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No drafts</h3>
              <p className="text-text-secondary">
                Your draft posts will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}