
import React, { useState } from 'react';
import { useFormatters } from "@/utils/formatters";
import SalesHeader from "@/components/sales/SalesHeader";
import SalesFilters from "@/components/sales/SalesFilters";
import SalesTable from "@/components/sales/SalesTable";
import SalesSummary from "@/components/sales/SalesSummary";
import { useSalesForm } from "@/hooks/useSalesForm";

const Sales = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showAddSale, setShowAddSale] = useState(false);
  const { formatCurrency, formatDate } = useFormatters();
  const { handleSubmit } = useSalesForm(() => {
    setShowAddSale(false);
  });

  const handleCreateSale = () => {
    setShowAddSale(true);
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <SalesHeader 
        onCreateSale={handleCreateSale} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <SalesFilters 
            dateRange={dateRange}
            setDateRange={setDateRange}
          />

          <SalesTable 
            searchQuery={searchQuery}
            dateRange={dateRange}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </div>

        <SalesSummary formatCurrency={formatCurrency} />
      </div>

      {showAddSale && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Create New Sale</h2>
                <button 
                  onClick={() => setShowAddSale(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Sale form content will be handled by the custom hook */}
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddSale(false)}
                    className="px-4 py-2 border rounded-md hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Create Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
