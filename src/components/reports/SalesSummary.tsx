
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SalesReportChart from './SalesReportChart';
import { mockSales } from "@/data/mockData";

interface SalesSummaryProps {
  formatCurrency: (value: number) => string;
  formatDate: (date: string | Date) => string;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({ formatCurrency, formatDate }) => {
  const [selectedView, setSelectedView] = useState("today");
  
  // Calculate total sales
  const totalAmount = mockSales.reduce((sum, sale) => sum + sale.grandTotal, 0);
  const totalCount = mockSales.length;
  const averageOrder = totalCount > 0 ? totalAmount / totalCount : 0;
  
  // Calculate today's sales
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySales = mockSales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    saleDate.setHours(0, 0, 0, 0);
    return saleDate.getTime() === today.getTime();
  });
  const todayAmount = todaySales.reduce((sum, sale) => sum + sale.grandTotal, 0);
  const todayCount = todaySales.length;
  
  // Calculate this week's sales
  const weekStart = new Date();
  weekStart.setDate(today.getDate() - today.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekSales = mockSales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return saleDate >= weekStart;
  });
  const weekAmount = weekSales.reduce((sum, sale) => sum + sale.grandTotal, 0);
  const weekCount = weekSales.length;
  
  // Calculate this month's sales
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthSales = mockSales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return saleDate >= monthStart;
  });
  const monthAmount = monthSales.reduce((sum, sale) => sum + sale.grandTotal, 0);
  const monthCount = monthSales.length;
  
  return (
    <Card className="col-span-2" id="sales-report-content">
      <CardHeader>
        <CardTitle>Sales Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-muted-foreground text-sm">Total Sales</div>
                <div className="text-2xl font-bold">{formatCurrency(todayAmount)}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-muted-foreground text-sm">Transactions</div>
                <div className="text-2xl font-bold">{todayCount}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-muted-foreground text-sm">Average Order</div>
                <div className="text-2xl font-bold">{formatCurrency(todayCount > 0 ? todayAmount / todayCount : 0)}</div>
              </div>
            </div>
            
            <SalesReportChart 
              data={todaySales} 
              formatCurrency={formatCurrency} 
              formatDate={formatDate} 
              reportType="daily"
            />
          </TabsContent>
          
          <TabsContent value="week" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-muted-foreground text-sm">Total Sales</div>
                <div className="text-2xl font-bold">{formatCurrency(weekAmount)}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-muted-foreground text-sm">Transactions</div>
                <div className="text-2xl font-bold">{weekCount}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-muted-foreground text-sm">Average Order</div>
                <div className="text-2xl font-bold">{formatCurrency(weekCount > 0 ? weekAmount / weekCount : 0)}</div>
              </div>
            </div>
            
            <SalesReportChart 
              data={weekSales} 
              formatCurrency={formatCurrency} 
              formatDate={formatDate}
              reportType="weekly"
            />
          </TabsContent>
          
          <TabsContent value="month" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-muted-foreground text-sm">Total Sales</div>
                <div className="text-2xl font-bold">{formatCurrency(monthAmount)}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-muted-foreground text-sm">Transactions</div>
                <div className="text-2xl font-bold">{monthCount}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-muted-foreground text-sm">Average Order</div>
                <div className="text-2xl font-bold">{formatCurrency(monthCount > 0 ? monthAmount / monthCount : 0)}</div>
              </div>
            </div>
            
            <SalesReportChart 
              data={monthSales} 
              formatCurrency={formatCurrency} 
              formatDate={formatDate}
              reportType="monthly"
            />
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-muted-foreground text-sm">Total Sales</div>
                <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-muted-foreground text-sm">Transactions</div>
                <div className="text-2xl font-bold">{totalCount}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-muted-foreground text-sm">Average Order</div>
                <div className="text-2xl font-bold">{formatCurrency(averageOrder)}</div>
              </div>
            </div>
            
            <SalesReportChart 
              data={mockSales} 
              formatCurrency={formatCurrency} 
              formatDate={formatDate}
              reportType="yearly"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalesSummary;
