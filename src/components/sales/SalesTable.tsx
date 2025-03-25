
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { mockSales } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface SalesTableProps {
  searchQuery: string;
  dateRange: { from?: Date; to?: Date };
  formatCurrency: (value: number) => string;
  formatDate: (date: string | Date) => string;
}

const SalesTable: React.FC<SalesTableProps> = ({ 
  searchQuery, 
  dateRange, 
  formatCurrency, 
  formatDate 
}) => {
  // Filter sales based on search query and date range
  const filteredSales = mockSales.filter(sale => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      !searchQuery || 
      sale.id.toLowerCase().includes(searchLower) ||
      (sale.customerName && sale.customerName.toLowerCase().includes(searchLower)) ||
      sale.status.toLowerCase().includes(searchLower);
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange.from || dateRange.to) {
      const saleDate = new Date(sale.createdAt);
      
      if (dateRange.from && dateRange.to) {
        // Both dates provided
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        
        matchesDateRange = saleDate >= fromDate && saleDate <= toDate;
      } else if (dateRange.from) {
        // Only from date
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        matchesDateRange = saleDate >= fromDate;
      } else if (dateRange.to) {
        // Only to date
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        matchesDateRange = saleDate <= toDate;
      }
    }
    
    return matchesSearch && matchesDateRange;
  });

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4">Sale ID</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-muted/50">
                    <td className="py-3 px-4">#{sale.id}</td>
                    <td className="py-3 px-4">{formatDate(sale.createdAt)}</td>
                    <td className="py-3 px-4">{sale.customerName || "Guest"}</td>
                    <td className="py-3 px-4">{formatCurrency(sale.grandTotal)}</td>
                    <td className="py-3 px-4">
                      <span className={cn("px-2 py-1 rounded-full text-xs", 
                        sale.status === "completed" ? "bg-green-100 text-green-800" : 
                        sale.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"
                      )}>
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No sales found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesTable;
