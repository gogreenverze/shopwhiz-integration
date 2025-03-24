
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockSales } from "@/data/mockData";
import { useFormatters } from "@/utils/formatters";
import { useState, useEffect } from "react";

interface SalesReportChartProps {
  reportType: "daily" | "weekly" | "monthly" | "yearly";
}

const SalesReportChart = ({ reportType }: SalesReportChartProps) => {
  const { formatCurrency } = useFormatters();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Process the data based on report type
    const processData = () => {
      if (reportType === "monthly") {
        // Group by month
        const monthlyData: { [key: string]: number } = {};

        mockSales.forEach(sale => {
          const date = new Date(sale.createdAt);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = 0;
          }
          
          monthlyData[monthKey] += sale.grandTotal;
        });

        return Object.entries(monthlyData).map(([month, total]) => {
          const [year, monthNum] = month.split('-');
          const date = new Date(Number(year), Number(monthNum) - 1, 1);
          const monthName = date.toLocaleString('default', { month: 'short' });
          
          return {
            name: `${monthName} ${year}`,
            total
          };
        }).sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      } else if (reportType === "daily") {
        // Group by day
        const dailyData: { [key: string]: number } = {};

        mockSales.forEach(sale => {
          const date = new Date(sale.createdAt);
          const dayKey = date.toISOString().split('T')[0];
          
          if (!dailyData[dayKey]) {
            dailyData[dayKey] = 0;
          }
          
          dailyData[dayKey] += sale.grandTotal;
        });

        return Object.entries(dailyData).map(([day, total]) => {
          const date = new Date(day);
          return {
            name: date.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
            total
          };
        }).sort((a, b) => a.name.localeCompare(b.name)).slice(-14); // Last 14 days
      } else if (reportType === "weekly") {
        // Group by week
        const weeklyData: { [key: string]: number } = {};

        mockSales.forEach(sale => {
          const date = new Date(sale.createdAt);
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          const weekKey = weekStart.toISOString().split('T')[0];
          
          if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = 0;
          }
          
          weeklyData[weekKey] += sale.grandTotal;
        });

        return Object.entries(weeklyData).map(([week, total]) => {
          const weekStart = new Date(week);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          
          return {
            name: `${weekStart.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`,
            total
          };
        }).sort((a, b) => a.name.localeCompare(b.name)).slice(-8); // Last 8 weeks
      } else {
        // Group by year
        const yearlyData: { [key: string]: number } = {};

        mockSales.forEach(sale => {
          const date = new Date(sale.createdAt);
          const yearKey = date.getFullYear().toString();
          
          if (!yearlyData[yearKey]) {
            yearlyData[yearKey] = 0;
          }
          
          yearlyData[yearKey] += sale.grandTotal;
        });

        return Object.entries(yearlyData).map(([year, total]) => ({
          name: year,
          total
        })).sort((a, b) => a.name.localeCompare(b.name));
      }
    };

    setChartData(processData());
  }, [reportType]);

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCurrency(value)}
            className="text-muted-foreground"
          />
          <Tooltip 
            formatter={(value) => formatCurrency(value as number)}
            labelFormatter={(label) => `Period: ${label}`}
          />
          <Bar 
            dataKey="total" 
            name="Total Sales" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesReportChart;
