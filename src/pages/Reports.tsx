
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFormatters } from "@/utils/formatters";
import { mockSales, mockProducts } from "@/data/mockData";
import { generatePDF, exportCSV } from "@/utils/exportUtils";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import SalesSummary from "@/components/reports/SalesSummary";
import ProductsSummary from "@/components/reports/ProductsSummary";
import InvoicesList from "@/components/reports/InvoicesList";
import ReportControls from "@/components/reports/ReportControls";

type ReportType = "daily" | "weekly" | "monthly" | "yearly";

const Reports = () => {
  const [selectedTab, setSelectedTab] = useState("sales");
  const [reportType, setReportType] = useState<ReportType>("monthly");
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date());
  const { formatCurrency, formatDate } = useFormatters();
  const { t } = useLanguage();

  const handleGeneratePDF = () => {
    const reportId = selectedTab === "sales" 
      ? "sales-report-content" 
      : selectedTab === "products" 
        ? "products-report-content" 
        : null;
        
    if (reportId) {
      generatePDF(reportId, `${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} ${reportType} Report`);
    } else {
      toast.error("Cannot export this section to PDF");
    }
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
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
              <TabsTrigger value="sales">Sales Report</TabsTrigger>
              <TabsTrigger value="products">Products Report</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
            </TabsList>
          
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 sm:hidden">
              <ReportControls
                reportType={reportType}
                setReportType={setReportType}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                handleGeneratePDF={handleGeneratePDF}
                handleExportCSV={handleExportCSV}
              />
            </div>
          </div>

          <TabsContent value="sales" className="mt-4">
            <SalesSummary 
              reportType={reportType} 
              formatCurrency={formatCurrency} 
              formatDate={formatDate} 
            />
          </TabsContent>

          <TabsContent value="products" className="mt-4">
            <ProductsSummary formatCurrency={formatCurrency} />
          </TabsContent>

          <TabsContent value="invoices" className="mt-4">
            <InvoicesList formatCurrency={formatCurrency} formatDate={formatDate} />
          </TabsContent>
        </Tabs>

        <div className="hidden sm:flex flex-wrap gap-2">
          <ReportControls
            reportType={reportType}
            setReportType={setReportType}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            handleGeneratePDF={handleGeneratePDF}
            handleExportCSV={handleExportCSV}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;

