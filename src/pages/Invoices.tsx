
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mockSales, mockCustomers, mockProducts } from "@/data/mockData";
import { useFormatters } from "@/utils/formatters";
import DataTable from "@/components/ui/DataTable";
import { FileText, Download, Mail, Printer, Search, Filter, Plus, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const Invoices = () => {
  const { formatCurrency, formatDate } = useFormatters();
  
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

  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customer: "",
    email: "",
    items: [{ product: "", quantity: 1, price: 0 }],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    notes: ""
  });

  const handleAddItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { product: "", quantity: 1, price: 0 }]
    });
  };

  const handleRemoveItem = (index: number) => {
    const items = [...newInvoice.items];
    items.splice(index, 1);
    setNewInvoice({ ...newInvoice, items });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const items = [...newInvoice.items];
    
    if (field === "product" && value) {
      const product = mockProducts.find(p => p.id === value);
      if (product) {
        items[index] = {
          ...items[index],
          [field]: value,
          price: product.price
        };
      }
    } else {
      items[index] = { ...items[index], [field]: value };
    }
    
    setNewInvoice({ ...newInvoice, items });
  };

  const calculateTotal = () => {
    return newInvoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCreateInvoice = () => {
    if (newInvoice.items.some(item => !item.product)) {
      toast.error("Please select products for all items");
      return;
    }
    
    toast.success("Invoice created successfully");
    setIsInvoiceDialogOpen(false);
    setNewInvoice({
      customer: "",
      email: "",
      items: [{ product: "", quantity: 1, price: 0 }],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: ""
    });
  };

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

        <Button onClick={() => setIsInvoiceDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <DataTable data={invoices} columns={columns} searchField="customerName" />

      {/* Create Invoice Dialog */}
      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Create an invoice to send to your customer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">Customer</Label>
              <Select
                value={newInvoice.customer}
                onValueChange={(value) => setNewInvoice({...newInvoice, customer: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Guest Customer</SelectItem>
                  {mockCustomers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                placeholder="customer@example.com"
                className="col-span-3"
                value={newInvoice.email}
                onChange={(e) => setNewInvoice({...newInvoice, email: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Items</Label>
              
              {newInvoice.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select
                    value={item.product}
                    onValueChange={(value) => handleItemChange(index, "product", value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {formatCurrency(product.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="number"
                    min="1"
                    className="w-20"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                  />
                  
                  <div className="w-24 text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                    disabled={newInvoice.items.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" onClick={handleAddItem} className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
              
              <div className="flex justify-between mt-4 font-medium">
                <span>Total</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Notes</Label>
              <Textarea
                id="notes"
                className="col-span-3"
                value={newInvoice.notes}
                onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                placeholder="Additional information or payment terms..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsInvoiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateInvoice}>
              <Check className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;

