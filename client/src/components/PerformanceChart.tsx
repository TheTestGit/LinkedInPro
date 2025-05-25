import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PerformanceChart() {
  const [period, setPeriod] = useState("7d");
  
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["/api/analytics/performance", { period }],
  });

  const formatChartData = () => {
    if (!chartData) return null;

    const labels = chartData.map((item: any) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Connection Requests',
          data: chartData.map((item: any) => item.connections),
          borderColor: 'hsl(207, 90%, 54%)', // LinkedIn blue
          backgroundColor: 'hsla(207, 90%, 54%, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Acceptances',
          data: chartData.map((item: any) => item.acceptances),
          borderColor: 'hsl(142, 71%, 45%)', // Success green
          backgroundColor: 'hsla(142, 71%, 45%, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  };

  const options = {
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

  const data = formatChartData();

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-text-primary">
              Automation Performance
            </CardTitle>
            <p className="text-text-secondary text-sm mt-1">
              Daily connection requests and acceptance rates
            </p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-64">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-text-secondary">Loading chart...</div>
            </div>
          ) : data ? (
            <Line data={data} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-text-secondary">No data available</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
