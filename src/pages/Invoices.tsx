
import { useState } from "react";
import { mockSales } from "@/data/mockData";
import { useFormatters } from "@/utils/formatters";
import InvoiceSummary from "@/components/invoices/InvoiceSummary";
import InvoiceTable from "@/components/invoices/InvoiceTable";
import InvoiceForm from "@/components/invoices/InvoiceForm";
import InvoiceSearch from "@/components/invoices/InvoiceSearch";

const Invoices = () => {
  const { formatCurrency, formatDate } = useFormatters();
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Transform sales into invoices
  const invoices = mockSales.map((sale) => ({
    id: `INV-${sale.id.substring(0, 6)}`,
    date: sale.createdAt,
    dueDate: new Date(sale.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days after
    customerName: sale.customerName || "Guest Customer",
    customerEmail: sale.customerName ? "customer@example.com" : "-",
    amount: sale.grandTotal,
    status: Math.random() > 0.3 ? "paid" : Math.random() > 0.5 ? "pending" : "overdue",
    items: sale.items,
  }));

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice => {
    if (!searchQuery) return true;
    return (
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Calculate summary data
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const pendingInvoices = invoices.filter((i) => i.status === "pending");
  const overdueInvoices = invoices.filter((i) => i.status === "overdue");

  const paidAmount = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          Manage customer invoices, track payments, and send reminders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <InvoiceSummary 
          title="Paid Invoices"
          count={paidInvoices.length}
          amount={paidAmount}
          status="paid"
          formatCurrency={formatCurrency}
        />
        
        <InvoiceSummary 
          title="Pending Invoices"
          count={pendingInvoices.length}
          amount={pendingAmount}
          status="pending"
          formatCurrency={formatCurrency}
        />
        
        <InvoiceSummary 
          title="Overdue Invoices"
          count={overdueInvoices.length}
          amount={overdueAmount}
          status="overdue"
          formatCurrency={formatCurrency}
        />
      </div>

      <InvoiceSearch 
        onCreateInvoice={() => setIsInvoiceDialogOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <InvoiceTable 
        invoices={filteredInvoices} 
        formatCurrency={formatCurrency} 
        formatDate={formatDate} 
      />

      <InvoiceForm 
        isOpen={isInvoiceDialogOpen}
        onOpenChange={setIsInvoiceDialogOpen}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default Invoices;
