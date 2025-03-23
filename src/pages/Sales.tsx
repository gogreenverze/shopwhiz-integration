
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/ui/DataTable";
import { mockSales, mockProducts, mockCustomers } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { FileText, Download, Printer, Search, Filter, Plus, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

const Sales = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isSaleDetailOpen, setIsSaleDetailOpen] = useState(false);
  const { t } = useLanguage();
  
  const [newSale, setNewSale] = useState({
    customer: "",
    items: [{ product: "", quantity: 1, price: 0 }],
    paymentMethod: "cash",
    notes: ""
  });
  
  const handleAddItem = () => {
    setNewSale({
      ...newSale,
      items: [...newSale.items, { product: "", quantity: 1, price: 0 }]
    });
  };
  
  const handleRemoveItem = (index: number) => {
    const items = [...newSale.items];
    items.splice(index, 1);
    setNewSale({ ...newSale, items });
  };
  
  const handleItemChange = (index: number, field: string, value: any) => {
    const items = [...newSale.items];
    
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
    
    setNewSale({ ...newSale, items });
  };
  
  const handleCreateSale = () => {
    if (newSale.items.some(item => !item.product)) {
      toast.error(t("sales.validation.products"));
      return;
    }
    
    toast.success(t("sales.success.created"));
    setIsNewSaleOpen(false);
    setNewSale({
      customer: "",
      items: [{ product: "", quantity: 1, price: 0 }],
      paymentMethod: "cash",
      notes: ""
    });
  };
  
  const handleViewSale = (sale: any) => {
    setSelectedSale(sale);
    setIsSaleDetailOpen(true);
  };
  
  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    toast.info(t("sales.info.filtersApplied"));
  };
  
  const handleDownloadReceipt = (saleId: string) => {
    toast.info(t("sales.info.downloaded", { id: saleId }));
  };
  
  const handlePrintReceipt = (saleId: string) => {
    toast.info(t("sales.info.printed", { id: saleId }));
  };
  
  const calculateTotal = () => {
    return newSale.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const filteredSales = mockSales.filter(sale => {
    if (!searchQuery) return true;
    
    return (
      sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sale.customerName && sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const columns = [
    {
      id: "sale",
      header: t("sales.table.id"),
      cell: (sale) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{sale.id}</div>
            <div className="text-sm text-muted-foreground">
              {sale.items.length} {t("sales.table.items")}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "customer",
      header: t("sales.table.customer"),
      cell: (sale) => (
        <div>
          <div className="font-medium">{sale.customerName || t("sales.guest")}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "amount",
      header: t("sales.table.amount"),
      cell: (sale) => (
        <div className="font-medium">
          {formatCurrency(sale.grandTotal)}
        </div>
      ),
      sortable: true,
    },
    {
      id: "date",
      header: t("sales.table.date"),
      cell: (sale) => formatDate(sale.createdAt),
      sortable: true,
    },
    {
      id: "status",
      header: t("sales.table.status"),
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
      header: t("sales.table.payment"),
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
            onClick={() => handleViewSale(sale)}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleDownloadReceipt(sale.id)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlePrintReceipt(sale.id)}
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
        <h1 className="text-3xl font-bold tracking-tight">{t("sales.title")}</h1>
        <p className="text-muted-foreground">
          {t("sales.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Badge className="bg-green-500 hover:bg-green-600">{t("sales.status.completed")}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("sales.completed")}</p>
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
              <Badge className="bg-yellow-500 hover:bg-yellow-600">{t("sales.status.pending")}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("sales.pending")}</p>
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
              <Badge className="bg-red-500 hover:bg-red-600">{t("sales.status.cancelled")}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("sales.cancelled")}</p>
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
            <Input 
              placeholder={t("sales.searchPlaceholder")} 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(true)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={() => setIsNewSaleOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("sales.actions.new")}
        </Button>
      </div>

      <DataTable data={filteredSales} columns={columns} searchField="id" />
      
      {/* New Sale Dialog */}
      <Dialog open={isNewSaleOpen} onOpenChange={setIsNewSaleOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>{t("sales.dialog.newTitle")}</DialogTitle>
            <DialogDescription>
              {t("sales.dialog.newDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right">{t("sales.form.customer")}</Label>
              <Select
                value={newSale.customer}
                onValueChange={(value) => setNewSale({...newSale, customer: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("sales.form.selectCustomer")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("sales.guest")}</SelectItem>
                  {mockCustomers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>{t("sales.form.items")}</Label>
              
              {newSale.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select
                    value={item.product}
                    onValueChange={(value) => handleItemChange(index, "product", value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={t("sales.form.selectProduct")} />
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
                    disabled={newSale.items.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" onClick={handleAddItem} className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                {t("sales.actions.addItem")}
              </Button>
              
              <div className="flex justify-between mt-4 font-medium">
                <span>{t("sales.form.total")}</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment" className="text-right">{t("sales.form.payment")}</Label>
              <Select
                value={newSale.paymentMethod}
                onValueChange={(value) => setNewSale({...newSale, paymentMethod: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{t("sales.payment.cash")}</SelectItem>
                  <SelectItem value="card">{t("sales.payment.card")}</SelectItem>
                  <SelectItem value="upi">{t("sales.payment.upi")}</SelectItem>
                  <SelectItem value="bank">{t("sales.payment.bank")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">{t("sales.form.notes")}</Label>
              <Input
                id="notes"
                className="col-span-3"
                value={newSale.notes}
                onChange={(e) => setNewSale({...newSale, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsNewSaleOpen(false)}>
              {t("sales.actions.cancel")}
            </Button>
            <Button type="button" onClick={handleCreateSale}>
              {t("sales.actions.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{t("sales.dialog.filterTitle")}</DialogTitle>
            <DialogDescription>
              {t("sales.dialog.filterDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>{t("sales.filter.status")}</Label>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="all">{t("sales.status.all")}</TabsTrigger>
                  <TabsTrigger value="completed">{t("sales.status.completed")}</TabsTrigger>
                  <TabsTrigger value="pending">{t("sales.status.pending")}</TabsTrigger>
                  <TabsTrigger value="cancelled">{t("sales.status.cancelled")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label>{t("sales.filter.dateRange")}</Label>
              <div className="flex items-center gap-2">
                <Input type="date" className="flex-1" />
                <span>-</span>
                <Input type="date" className="flex-1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("sales.filter.payment")}</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder={t("sales.filter.allPayments")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("sales.filter.allPayments")}</SelectItem>
                  <SelectItem value="cash">{t("sales.payment.cash")}</SelectItem>
                  <SelectItem value="card">{t("sales.payment.card")}</SelectItem>
                  <SelectItem value="upi">{t("sales.payment.upi")}</SelectItem>
                  <SelectItem value="bank">{t("sales.payment.bank")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline">
              {t("sales.actions.reset")}
            </Button>
            <Button type="button" onClick={handleApplyFilters}>
              {t("sales.actions.apply")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sale Detail Dialog */}
      {selectedSale && (
        <Dialog open={isSaleDetailOpen} onOpenChange={setIsSaleDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("sales.detail.title", { id: selectedSale.id })}</DialogTitle>
              <DialogDescription>
                {formatDate(selectedSale.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t("sales.detail.customer")}</p>
                  <p className="font-medium">{selectedSale.customerName || t("sales.guest")}</p>
                </div>
                <Badge
                  className={
                    selectedSale.status === "completed"
                      ? "bg-green-500 hover:bg-green-600"
                      : selectedSale.status === "pending"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-red-500 hover:bg-red-600"
                  }
                >
                  {selectedSale.status}
                </Badge>
              </div>
              
              <div className="border rounded-md divide-y">
                {selectedSale.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">{t("sales.detail.subtotal")}</p>
                  <p>{formatCurrency(selectedSale.subtotal)}</p>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-muted-foreground">{t("sales.detail.tax")} ({selectedSale.taxRate}%)</p>
                  <p>{formatCurrency(selectedSale.taxAmount)}</p>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-muted-foreground">{t("sales.detail.discount")}</p>
                  <p>- {formatCurrency(selectedSale.discount || 0)}</p>
                </div>
                <div className="flex justify-between mt-3 font-bold text-lg">
                  <p>{t("sales.detail.total")}</p>
                  <p>{formatCurrency(selectedSale.grandTotal)}</p>
                </div>
              </div>
              
              <div className="flex justify-between mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">{t("sales.detail.paymentMethod")}</p>
                  <p className="font-medium capitalize">{selectedSale.paymentMethod}</p>
                </div>
                {selectedSale.status === "completed" && (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{t("sales.detail.paid")}</span>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => handlePrintReceipt(selectedSale.id)}>
                <Printer className="mr-2 h-4 w-4" />
                {t("sales.actions.print")}
              </Button>
              <Button onClick={() => handleDownloadReceipt(selectedSale.id)}>
                <Download className="mr-2 h-4 w-4" />
                {t("sales.actions.download")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Sales;
