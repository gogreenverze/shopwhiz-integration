
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormatters } from "@/utils/formatters";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDailySales } from "@/services/api";

interface SalesChartProps {
  className?: string;
}

const SalesChart = ({ className }: SalesChartProps) => {
  const [chartPeriod, setChartPeriod] = useState<"week" | "month" | "year">("week");
  const { formatCurrency } = useFormatters();
  
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['dailySales', chartPeriod],
    queryFn: () => getDailySales(chartPeriod === "week" ? 7 : chartPeriod === "month" ? 30 : 365),
  });
  
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (apiData) {
      // Transform the data for the chart
      const transformedData = apiData.map((item: any) => ({
        name: new Date(item.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        value: item.total
      }));
      
      setChartData(transformedData);
    }
  }, [apiData]);

  const getGradientOffset = () => {
    if (!chartData.length) return 0;
    const dataMax = Math.max(...chartData.map((i) => i.value));
    const dataMin = Math.min(...chartData.map((i) => i.value));
  
    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }
  
    return dataMax / (dataMax - dataMin);
  };

  const gradientOffset = getGradientOffset();

  return (
    <Card className={`glass-card ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {chartPeriod === "week" 
                ? "Last 7 days" 
                : chartPeriod === "month" 
                  ? "Last 30 days" 
                  : "This year"}
            </CardDescription>
          </div>
          
          <Tabs 
            defaultValue="week" 
            className="w-auto"
            onValueChange={(value) => setChartPeriod(value as "week" | "month" | "year")}
          >
            <TabsList className="h-8">
              <TabsTrigger value="week" className="text-xs px-3">Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-3">Month</TabsTrigger>
              <TabsTrigger value="year" className="text-xs px-3">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full px-2">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 5,
                  left: 0,
                  bottom: 20,
                }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                  className="text-muted-foreground"
                  dx={-5}
                />
                <Tooltip 
                  formatter={(value) => formatCurrency(value as number)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={1500}
                  dot={{ r: 3, strokeWidth: 1, fill: "#fff" }}
                  activeDot={{ r: 5, strokeWidth: 0, fill: "#3b82f6" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
