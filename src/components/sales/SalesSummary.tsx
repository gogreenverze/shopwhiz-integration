
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSales } from "@/data/mockData";

interface SalesSummaryProps {
  formatCurrency: (value: number) => string;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({ formatCurrency }) => {
  // Calculate sales summary statistics
  const totalSales = mockSales.reduce((sum, sale) => sum + sale.grandTotal, 0);
  const salesCount = mockSales.length;
  const averageSale = salesCount > 0 ? totalSales / salesCount : 0;

  // Get completed sales
  const completedSales = mockSales.filter(sale => sale.status === "completed");
  const completedTotal = completedSales.reduce((sum, sale) => sum + sale.grandTotal, 0);
  const completedCount = completedSales.length;
  
  // Get pending sales
  const pendingSales = mockSales.filter(sale => sale.status === "pending");
  const pendingTotal = pendingSales.reduce((sum, sale) => sum + sale.grandTotal, 0);
  const pendingCount = pendingSales.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Sales Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Sales</span>
            <span className="font-medium">{formatCurrency(totalSales)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Sales Count</span>
            <span className="font-medium">{salesCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Average Sale</span>
            <span className="font-medium">{formatCurrency(averageSale)}</span>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <h4 className="text-sm font-medium mb-2">By Status</h4>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Completed</span>
            <span className="font-medium">{formatCurrency(completedTotal)} ({completedCount})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Pending</span>
            <span className="font-medium">{formatCurrency(pendingTotal)} ({pendingCount})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesSummary;
