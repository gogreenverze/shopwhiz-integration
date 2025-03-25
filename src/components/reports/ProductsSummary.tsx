
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import ProductsReportChart from "@/components/reports/ProductsReportChart";
import ReportTable from "@/components/reports/ReportTable";
import { mockProducts } from "@/data/mockData";

interface ProductsSummaryProps {
  formatCurrency: (value: number) => string;
}

const ProductsSummary: React.FC<ProductsSummaryProps> = ({
  formatCurrency
}) => {
  return (
    <div id="products-report-content" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductsReportChart />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PieChart className="h-52 w-52 text-primary/80" />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 glass-card">
        <CardHeader>
          <CardTitle>Products Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportTable 
            data={mockProducts} 
            type="products" 
            formatCurrency={formatCurrency}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsSummary;

