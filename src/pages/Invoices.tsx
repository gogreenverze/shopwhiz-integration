
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockSales } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters";
import DataTable from "@/components/ui/DataTable";
import { FileText, Download, Mail, Printer, Search, Filter, Plus } from "lucide-react";
import { toast } from "sonner";

const Invoices = () => {
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

  const columns = [
    {
      id: "invoice",
      header: "Invoice",
      cell: (invoice) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
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
      cell: (invoice) => (
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
      cell: (invoice) => (
        <div className="font-medium">
          {formatCurrency(invoice.amount)}
        </div>
      ),
      sortable: true,
    },
    {
      id: "date",
      header: "Date",
      cell: (invoice) => formatDate(invoice.date),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (invoice) => (
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
      cell: (invoice) => (
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
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          Manage customer invoices, track payments, and send reminders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Paid Invoices</p>
              <h3 className="text-2xl font-bold">
                {invoices.filter((i) => i.status === "paid").length}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(
                  invoices
                    .filter((i) => i.status === "paid")
                    .reduce((sum, i) => sum + i.amount, 0)
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Invoices</p>
              <h3 className="text-2xl font-bold">
                {invoices.filter((i) => i.status === "pending").length}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(
                  invoices
                    .filter((i) => i.status === "pending")
                    .reduce((sum, i) => sum + i.amount, 0)
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Badge className="bg-red-500 hover:bg-red-600">Overdue</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue Invoices</p>
              <h3 className="text-2xl font-bold">
                {invoices.filter((i) => i.status === "overdue").length}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(
                  invoices
                    .filter((i) => i.status === "overdue")
                    .reduce((sum, i) => sum + i.amount, 0)
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search invoices..." className="pl-9" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <DataTable data={invoices} columns={columns} searchField="customerName" />
    </div>
  );
};

export default Invoices;
