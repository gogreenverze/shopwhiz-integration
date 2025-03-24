
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useFormatters } from "@/utils/formatters";
import { CalendarIcon, Download, FileText, Table, PieChart, BarChartHorizontal, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockSales, mockProducts } from "@/data/mockData";
import SalesReportChart from "@/components/reports/SalesReportChart";
import ProductsReportChart from "@/components/reports/ProductsReportChart";
import ReportTable from "@/components/reports/ReportTable";
import { generatePDF, exportCSV } from "@/utils/exportUtils";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const Reports = () => {
  const [selectedTab, setSelectedTab] = useState("sales");
  const [reportType, setReportType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date());
  const { formatCurrency, formatDate } = useFormatters();
  const { t } = useLanguage();

  const handleGeneratePDF = () => {
    generatePDF(`${selectedTab}-${reportType}-report`, `${selectedTab.toUpperCase()} ${reportType} Report`);
    toast.success(`${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} report PDF generated successfully`);
  };

  const handleExportCSV = () => {
    let data = [];
    let headers = [];

    if (selectedTab === "sales") {
      headers = ["ID", "Date", "Customer", "Total", "Status"];
      data = mockSales.map(sale => [
        sale.id,
        formatDate(sale.createdAt),
        sale.customerName || "Guest",
        sale.grandTotal,
        sale.status
      ]);
    } else if (selectedTab === "products") {
      headers = ["ID", "Product", "Category", "Price", "Stock"];
      data = mockProducts.map(product => [
        product.id,
        product.name,
        product.category,
        product.price,
        product.stock
      ]);
    }

    exportCSV(data, headers, `${selectedTab}-${reportType}-report`);
    toast.success(`${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} CSV exported successfully`);
  };

  const handlePrintInvoice = (saleId: string) => {
    const sale = mockSales.find(s => s.id === saleId);
    if (sale) {
      generatePDF(`invoice-${saleId}`, `Invoice #${saleId}`, 'invoice', sale);
      toast.success(`Invoice #${saleId} generated successfully`);
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and view business reports and analytics.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs 
          value={selectedTab} 
          onValueChange={setSelectedTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
            <TabsTrigger value="sales">Sales Report</TabsTrigger>
            <TabsTrigger value="products">Products Report</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          <Select
            value={reportType}
            onValueChange={setReportType}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedMonth ? format(selectedMonth, 'MMMM yyyy') : <span>Pick a month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedMonth}
                onSelect={setSelectedMonth}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={handleGeneratePDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          
          <Button variant="outline" onClick={handleExportCSV}>
            <Table className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <TabsContent value="sales" className="mt-0" hidden={selectedTab !== "sales"}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 glass-card">
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesReportChart reportType={reportType} />
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Sales Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <PieChart className="h-52 w-52 text-primary/80" />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 glass-card">
          <CardHeader>
            <CardTitle>Sales Data</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportTable 
              data={mockSales} 
              type="sales" 
              formatCurrency={formatCurrency} 
              formatDate={formatDate} 
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="products" className="mt-0" hidden={selectedTab !== "products"}>
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
      </TabsContent>

      <TabsContent value="invoices" className="mt-0" hidden={selectedTab !== "invoices"}>
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
      </TabsContent>
    </div>
  );
};

export default Reports;
