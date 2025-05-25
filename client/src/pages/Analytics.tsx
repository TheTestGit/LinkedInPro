import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { TrendingUp, Users, MessageSquare, Heart, Share2, Calendar } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function Analytics() {
  const [period, setPeriod] = useState("7d");
  
  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ["/api/analytics/performance", { period }],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Segoe UI, SF Pro Display, system-ui, sans-serif'
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Segoe UI, SF Pro Display, system-ui, sans-serif'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            family: 'Segoe UI, SF Pro Display, system-ui, sans-serif'
          }
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  const formatPerformanceData = () => {
    if (!performanceData) return null;

    const labels = performanceData.map((item: any) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Connection Requests',
          data: performanceData.map((item: any) => item.connections),
          borderColor: 'hsl(207, 90%, 54%)',
          backgroundColor: 'hsla(207, 90%, 54%, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Acceptances',
          data: performanceData.map((item: any) => item.acceptances),
          borderColor: 'hsl(142, 71%, 45%)',
          backgroundColor: 'hsla(142, 71%, 45%, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Engagement',
          data: performanceData.map((item: any) => item.engagement),
          borderColor: 'hsl(32, 95%, 58%)',
          backgroundColor: 'hsla(32, 95%, 58%, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  };

  const formatEngagementData = () => {
    if (!performanceData) return null;

    const labels = performanceData.map((item: any) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Engagement Actions',
          data: performanceData.map((item: any) => item.engagement),
          backgroundColor: [
            'hsla(207, 90%, 54%, 0.8)',
            'hsla(142, 71%, 45%, 0.8)',
            'hsla(32, 95%, 58%, 0.8)',
            'hsla(280, 100%, 70%, 0.8)',
            'hsla(200, 100%, 80%, 0.8)',
            'hsla(340, 100%, 75%, 0.8)',
            'hsla(120, 100%, 75%, 0.8)',
          ],
          borderColor: [
            'hsl(207, 90%, 54%)',
            'hsl(142, 71%, 45%)',
            'hsl(32, 95%, 58%)',
            'hsl(280, 100%, 70%)',
            'hsl(200, 100%, 80%)',
            'hsl(340, 100%, 75%)',
            'hsl(120, 100%, 75%)',
          ],
          borderWidth: 2,
        }
      ]
    };
  };

  const responseRateData = {
    labels: ['Accepted', 'Pending', 'Declined'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          'hsl(142, 71%, 45%)',
          'hsl(32, 95%, 58%)',
          'hsl(0, 84%, 60%)',
        ],
        borderWidth: 0,
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            family: 'Segoe UI, SF Pro Display, system-ui, sans-serif'
          }
        }
      }
    }
  };

  const performanceChartData = formatPerformanceData();
  const engagementChartData = formatEngagementData();

  const metrics = [
    {
      title: "Total Connections",
      value: stats?.connectionsSent || 0,
      change: "+12.5%",
      changeType: "positive",
      icon: Users,
      color: "bg-linkedin/10 text-linkedin"
    },
    {
      title: "Response Rate",
      value: `${stats?.responseRate || 0}%`,
      change: "-2.1%",
      changeType: "negative", 
      icon: TrendingUp,
      color: "bg-success/10 text-success"
    },
    {
      title: "Messages Sent",
      value: "156",
      change: "+8.2%",
      changeType: "positive",
      icon: MessageSquare,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Content Shared",
      value: stats?.contentShared || 0,
      change: "+15.3%",
      changeType: "positive",
      icon: Share2,
      color: "bg-warning/10 text-warning"
    }
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Analytics & Insights</h1>
          <p className="text-text-secondary mt-1">
            Track your LinkedIn automation performance and engagement metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-sm font-medium">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-semibold text-text-primary mt-1">
                      {metric.value}
                    </p>
                    <p className={`text-sm mt-1 ${
                      metric.changeType === 'positive' ? 'text-success' : 'text-destructive'
                    }`}>
                      {metric.change} vs last period
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Performance Trend */}
        <div className="xl:col-span-2">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-text-primary">
                Performance Trends
              </CardTitle>
              <p className="text-text-secondary text-sm">
                Daily automation performance over time
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {performanceLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-text-secondary">Loading chart...</div>
                  </div>
                ) : performanceChartData ? (
                  <Line data={performanceChartData} options={chartOptions} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-text-secondary">No data available</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Response Rate Breakdown */}
        <div>
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-text-primary">
                Response Rate
              </CardTitle>
              <p className="text-text-secondary text-sm">
                Connection request outcomes
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Doughnut data={responseRateData} options={doughnutOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Engagement Details */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-text-primary">
              Daily Engagement
            </CardTitle>
            <p className="text-text-secondary text-sm">
              Likes, comments, and other engagement activities
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {engagementChartData ? (
                <Bar data={engagementChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-text-secondary">No engagement data</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-text-primary">
              Weekly Summary
            </CardTitle>
            <p className="text-text-secondary text-sm">
              Key metrics for this week
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-linkedin/10 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-linkedin" />
                  </div>
                  <span className="font-medium text-text-primary">Connections Sent</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text-primary">247</p>
                  <p className="text-xs text-success">+12% vs last week</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <span className="font-medium text-text-primary">Acceptance Rate</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text-primary">68%</p>
                  <p className="text-xs text-destructive">-3% vs last week</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Heart className="h-4 w-4 text-warning" />
                  </div>
                  <span className="font-medium text-text-primary">Total Engagements</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text-primary">892</p>
                  <p className="text-xs text-success">+18% vs last week</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Share2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-text-primary">Content Shared</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text-primary">24</p>
                  <p className="text-xs text-success">+5% vs last week</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}