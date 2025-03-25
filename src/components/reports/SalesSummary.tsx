
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import SalesReportChart from "@/components/reports/SalesReportChart";
import ReportTable from "@/components/reports/ReportTable";
import { mockSales } from "@/data/mockData";

interface SalesSummaryProps {
  reportType: "daily" | "weekly" | "monthly" | "yearly";
  formatCurrency: (value: number) => string;
  formatDate: (date: string | Date) => string; // Updated to accept string | Date
}

const SalesSummary: React.FC<SalesSummaryProps> = ({
  reportType,
  formatCurrency,
  formatDate
}) => {
  return (
    <div id="sales-report-content" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesReportChart reportType={reportType} />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Sales Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PieChart className="h-52 w-52 text-primary/80" />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 glass-card">
        <CardHeader>
          <CardTitle>Sales Data</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportTable 
            data={mockSales} 
            type="sales" 
            formatCurrency={formatCurrency} 
            formatDate={formatDate} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesSummary;
