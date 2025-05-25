import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Book, 
  Video, 
  Download,
  ExternalLink,
  Search,
  HelpCircle
} from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: string;
}

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      priority: "medium"
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Support Request Sent",
        description: "We've received your message and will respond within 24 hours.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send support request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const faqs = [
    {
      question: "How do I connect my LinkedIn account?",
      answer: "Go to Settings > LinkedIn tab and click 'Connect LinkedIn Account'. You'll be redirected to LinkedIn for secure OAuth authentication. We never store your LinkedIn credentials."
    },
    {
      question: "What are the daily limits for automation?",
      answer: "To comply with LinkedIn's terms of service, we recommend: 25 connection requests per day, 50 likes per day, and 10 comments per day. You can adjust these in your campaign settings."
    },
    {
      question: "How do I schedule LinkedIn posts?",
      answer: "Navigate to Content > Create Post, write your content, select post type, and choose your desired date and time. Posts will be automatically published at the scheduled time."
    },
    {
      question: "Can I pause my automation campaigns?",
      answer: "Yes! Click the pause button on any campaign card in the Automation page. You can resume campaigns at any time without losing your settings."
    },
    {
      question: "How accurate are the analytics reports?",
      answer: "Our analytics sync with LinkedIn's data every 6 hours. Data includes connections made, engagement rates, profile views, and campaign performance metrics."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption, secure OAuth authentication, and never store your LinkedIn password. All data is encrypted in transit and at rest."
    },
    {
      question: "What happens if I exceed LinkedIn's limits?",
      answer: "Our system automatically monitors your activity and will pause campaigns if you approach LinkedIn's limits. You'll receive notifications about any limit warnings."
    },
    {
      question: "Can I export my automation data?",
      answer: "Yes, go to Analytics and click the export button to download your data in CSV format. This includes all campaigns, connections, and engagement metrics."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-text-primary">Support Center</h1>
        <p className="text-text-secondary mt-1">
          Get help with your LinkedIn automation platform
        </p>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>Frequently Asked Questions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search FAQs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Accordion type="single" collapsible className="space-y-2">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-text-secondary pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8 text-text-secondary">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No FAQs match your search. Try a different keyword or contact support.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Book className="h-8 w-8 text-linkedin" />
                  <div>
                    <CardTitle className="text-lg">Getting Started Guide</CardTitle>
                    <p className="text-sm text-text-secondary">Complete setup walkthrough</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Learn how to set up your first automation campaign and connect your LinkedIn account.
                </p>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Read Guide
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Video className="h-8 w-8 text-linkedin" />
                  <div>
                    <CardTitle className="text-lg">Video Tutorials</CardTitle>
                    <p className="text-sm text-text-secondary">Step-by-step video guides</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Watch our comprehensive video tutorials covering all platform features.
                </p>
                <Button className="w-full" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Download className="h-8 w-8 text-linkedin" />
                  <div>
                    <CardTitle className="text-lg">Best Practices</CardTitle>
                    <p className="text-sm text-text-secondary">Optimize your campaigns</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-4">
                  Download our guide to LinkedIn automation best practices and compliance.
                </p>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-linkedin" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-text-secondary">support@linkedinautomation.com</p>
                    <p className="text-sm text-text-secondary">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-linkedin" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-text-secondary">Available 9 AM - 6 PM EST</p>
                    <Button className="mt-2" size="sm">
                      Start Chat
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-linkedin" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-text-secondary">+1 (555) 123-4567</p>
                    <p className="text-sm text-text-secondary">Business hours only</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-linkedin" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-text-secondary">Monday - Friday: 9 AM - 6 PM EST</p>
                    <p className="text-text-secondary">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Send Support Request</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief description of your issue" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your issue in detail..."
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-linkedin hover:bg-linkedin/90"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Sending..." : "Send Support Request"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>System Status</span>
                <Badge className="bg-green-100 text-green-700">All Systems Operational</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">LinkedIn API</p>
                        <p className="text-sm text-text-secondary">Connection and automation services</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Operational</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Content Scheduling</p>
                        <p className="text-sm text-text-secondary">Post scheduling and publishing</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Operational</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Analytics Engine</p>
                        <p className="text-sm text-text-secondary">Data processing and reporting</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Operational</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Database</p>
                        <p className="text-sm text-text-secondary">Data storage and retrieval</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Operational</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Authentication</p>
                        <p className="text-sm text-text-secondary">User login and security</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Operational</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Notifications</p>
                        <p className="text-sm text-text-secondary">Email and in-app notifications</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Operational</Badge>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Recent Updates</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">System Maintenance Completed</p>
                      <p className="text-text-secondary">All systems running smoothly after scheduled maintenance - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Performance Improvements</p>
                      <p className="text-text-secondary">Analytics dashboard loading speed improved by 40% - 1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">New Features Released</p>
                      <p className="text-text-secondary">Advanced campaign settings and bulk editing now available - 3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}