
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/ui/DataTable";
import { mockSales } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { FileText, Download, Printer, Search, Filter, Plus } from "lucide-react";
import { toast } from "sonner";

const Sales = () => {
  const columns = [
    {
      id: "sale",
      header: "Sale ID",
      cell: (sale) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{sale.id}</div>
            <div className="text-sm text-muted-foreground">
              {sale.items.length} items
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: (sale) => (
        <div>
          <div className="font-medium">{sale.customerName || "Guest Customer"}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "amount",
      header: "Amount",
      cell: (sale) => (
        <div className="font-medium">
          {formatCurrency(sale.grandTotal)}
        </div>
      ),
      sortable: true,
    },
    {
      id: "date",
      header: "Date",
      cell: (sale) => formatDate(sale.createdAt),
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (sale) => (
        <Badge
          className={
            sale.status === "completed"
              ? "bg-green-500 hover:bg-green-600"
              : sale.status === "pending"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-red-500 hover:bg-red-600"
          }
        >
          {sale.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: "payment",
      header: "Payment",
      cell: (sale) => sale.paymentMethod,
      sortable: true,
    },
    {
      id: "actions",
      header: "",
      cell: (sale) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => toast.info(`Downloaded receipt for ${sale.id}`)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => toast.info(`Printed receipt for ${sale.id}`)}
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
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <p className="text-muted-foreground">
          View and manage all sales transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Sales</p>
              <h3 className="text-2xl font-bold">
                {mockSales.filter((s) => s.status === "completed").length}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(
                  mockSales
                    .filter((s) => s.status === "completed")
                    .reduce((sum, s) => sum + s.grandTotal, 0)
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
              <p className="text-sm font-medium text-muted-foreground">Pending Sales</p>
              <h3 className="text-2xl font-bold">
                {mockSales.filter((s) => s.status === "pending").length}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(
                  mockSales
                    .filter((s) => s.status === "pending")
                    .reduce((sum, s) => sum + s.grandTotal, 0)
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cancelled Sales</p>
              <h3 className="text-2xl font-bold">
                {mockSales.filter((s) => s.status === "cancelled").length}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(
                  mockSales
                    .filter((s) => s.status === "cancelled")
                    .reduce((sum, s) => sum + s.grandTotal, 0)
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
            <Input placeholder="Search sales..." className="pl-9" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </div>

      <DataTable data={mockSales} columns={columns} searchField="id" />
    </div>
  );
};

export default Sales;
