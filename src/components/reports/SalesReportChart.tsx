
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFormatters } from "@/utils/formatters";
import { mockSales } from "@/data/mockData";

interface SalesData {
  date: string;
  value: number;
}

interface SalesReportChartProps {
  reportType?: "daily" | "weekly" | "monthly" | "yearly";
  data?: any[];
  formatCurrency?: (value: number) => string;
  formatDate?: (date: string | Date) => string;
}

const SalesReportChart = ({ 
  reportType, 
  data = mockSales,
  formatCurrency: propFormatCurrency,
  formatDate 
}: SalesReportChartProps) => {
  const formatters = useFormatters();
  const formatCurrency = propFormatCurrency || formatters.formatCurrency;

  const chartData: SalesData[] = data.map((sale) => ({
    date: typeof sale.createdAt === 'string' 
      ? sale.createdAt 
      : sale.createdAt.toLocaleDateString(),
    value: sale.grandTotal,
  }));

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="text-muted-foreground" />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <Tooltip 
            formatter={(value) => formatCurrency(value as number)}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#60a5fa" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesReportChart;
