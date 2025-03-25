
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InvoiceSummaryProps {
  title: string;
  count: number;
  amount: number;
  status: "paid" | "pending" | "overdue";
  formatCurrency: (value: number) => string;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  title,
  count,
  amount,
  status,
  formatCurrency
}) => {
  const getBadgeColor = () => {
    switch (status) {
      case "paid": return "bg-green-500 hover:bg-green-600";
      case "pending": return "bg-yellow-500 hover:bg-yellow-600";
      case "overdue": return "bg-red-500 hover:bg-red-600";
      default: return "";
    }
  };
  
  const getBgColor = () => {
    switch (status) {
      case "paid": return "bg-green-500/10";
      case "pending": return "bg-yellow-500/10";
      case "overdue": return "bg-red-500/10";
      default: return "";
    }
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${getBgColor()} flex items-center justify-center`}>
          <Badge className={getBadgeColor()}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{count}</h3>
          <p className="text-sm text-muted-foreground">{formatCurrency(amount)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceSummary;
