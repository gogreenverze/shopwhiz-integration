
import { useFormatters } from "@/utils/formatters";
import DashboardCard from "./DashboardCard";
import { ArrowRight, Banknote, CreditCard, Percent, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { TimeRange } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { getSalesSummary, SalesSummary } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

interface MetricsDisplayProps {
  className?: string;
}

const MetricsDisplay = ({ className }: MetricsDisplayProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const { formatCurrency, formatNumber } = useFormatters();
  
  const { data: salesData, isLoading } = useQuery({
    queryKey: ['salesSummary', timeRange],
    queryFn: () => getSalesSummary(timeRange),
    initialData: {
      totalSales: 0,
      totalTransactions: 0,
      averageOrder: 0,
      compareToLastPeriod: 0
    } as SalesSummary
  });
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Key Metrics</h2>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
        >
          <SelectTrigger className="w-[150px] h-8 text-sm">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="last7days">Last 7 days</SelectItem>
            <SelectItem value="last30days">Last 30 days</SelectItem>
            <SelectItem value="thisMonth">This month</SelectItem>
            <SelectItem value="lastMonth">Last month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Sales"
          value={formatCurrency(salesData?.totalSales || 0)}
          icon={<Banknote className="w-5 h-5" />}
          trend={salesData?.compareToLastPeriod || 0}
          isLoading={isLoading}
          footer={
            <Button variant="ghost" size="sm" className="p-0 h-auto text-primary hover:text-primary/80 flex items-center">
              <span className="text-xs">View report</span>
              <ArrowRight className="ml-1 w-3 h-3" />
            </Button>
          }
        />
        
        <DashboardCard
          title="Transactions"
          value={formatNumber(salesData?.totalTransactions || 0)}
          icon={<CreditCard className="w-5 h-5" />}
          subtitle="Total orders"
          isLoading={isLoading}
        />
        
        <DashboardCard
          title="Average Order"
          value={formatCurrency(salesData?.averageOrder || 0)}
          icon={<ShoppingBag className="w-5 h-5" />}
          trend={1.2}
          isLoading={isLoading}
        />
        
        <DashboardCard
          title="Conversion Rate"
          value={`${7.3}%`}
          icon={<Percent className="w-5 h-5" />}
          trend={-0.5}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default MetricsDisplay;
