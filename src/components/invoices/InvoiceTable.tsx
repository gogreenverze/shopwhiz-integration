
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Mail, Printer } from "lucide-react";
import DataTable from "@/components/ui/DataTable";

interface InvoiceItem {
  id: string;
  date: Date;
  dueDate: Date;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: string;
  items: any[];
}

interface InvoiceTableProps {
  invoices: InvoiceItem[];
  formatCurrency: (value: number) => string;
  formatDate: (date: Date) => string;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  formatCurrency,
  formatDate
}) => {
  const columns = [
    {
      id: "invoice",
      header: "Invoice",
      cell: (invoice: InvoiceItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{invoice.id}</div>
            <div className="text-sm text-muted-foreground">
              {invoice.items.length} items
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: (invoice: InvoiceItem) => (
        <div>
          <div className="font-medium">{invoice.customerName}</div>
          <div className="text-sm text-muted-foreground">{invoice.customerEmail}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "amount",
      header: "Amount",
      cell: (invoice: InvoiceItem) => (
        <div className="font-medium">
          {formatCurrency(invoice.amount)}
        </div>
      ),
      sortable: true,
    },
    {
      id: "date",
      header: "Date",
      cell: (invoice: InvoiceItem) => formatDate(invoice.date),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (invoice: InvoiceItem) => (
        <Badge
          className={
            invoice.status === "paid"
              ? "bg-green-500 hover:bg-green-600"
              : invoice.status === "pending"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-red-500 hover:bg-red-600"
          }
        >
          {invoice.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: "actions",
      header: "",
      cell: (invoice: InvoiceItem) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => toast.info(`Downloaded invoice ${invoice.id}`)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => toast.info(`Sent email with invoice ${invoice.id}`)}
          >
            <Mail className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => toast.info(`Printed invoice ${invoice.id}`)}
          >
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable data={invoices} columns={columns} searchField="customerName" />
  );
};

export default InvoiceTable;
