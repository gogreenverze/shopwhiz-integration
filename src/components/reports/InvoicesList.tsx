
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockSales } from "@/data/mockData";
import { generatePDF } from "@/utils/exportUtils";
import { toast } from "sonner";

interface InvoicesListProps {
  formatCurrency: (value: number) => string;
  formatDate: (date: Date) => string;
}

const InvoicesList: React.FC<InvoicesListProps> = ({
  formatCurrency,
  formatDate
}) => {
  const handlePrintInvoice = (saleId: string) => {
    const sale = mockSales.find(s => s.id === saleId);
    if (sale) {
      generatePDF(`invoice-${saleId}`, `Invoice #${saleId}`, 'invoice', sale);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3">Invoice #</th>
                <th className="text-left p-3">Customer</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockSales.slice(0, 10).map((sale) => (
                <tr key={sale.id} className="hover:bg-muted/30">
                  <td className="p-3">INV-{sale.id}</td>
                  <td className="p-3">{sale.customerName || "Guest"}</td>
                  <td className="p-3">{formatDate(sale.createdAt)}</td>
                  <td className="p-3">{formatCurrency(sale.grandTotal)}</td>
                  <td className="p-3">
                    <span className={cn("px-2 py-1 rounded-full text-xs", 
                      sale.status === "completed" ? "bg-green-100 text-green-800" : 
                      sale.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                      "bg-red-100 text-red-800"
                    )}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handlePrintInvoice(sale.id)}>
                      <Printer className="h-4 w-4" />
                      <span className="sr-only">Print</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicesList;

