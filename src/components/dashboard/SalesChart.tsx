
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDailySales } from "@/data/mockData";
import { formatCurrency } from "@/utils/formatters";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

interface SalesChartProps {
  className?: string;
}

const SalesChart = ({ className }: SalesChartProps) => {
  const [chartPeriod, setChartPeriod] = useState<"week" | "month" | "year">("week");
  
  const data = mockDailySales.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    value: item.total
  }));

  const getGradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.value));
    const dataMin = Math.min(...data.map((i) => i.value));
  
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
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
