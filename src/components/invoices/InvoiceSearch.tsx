
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Plus, Search } from "lucide-react";

interface InvoiceSearchProps {
  onCreateInvoice: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const InvoiceSearch: React.FC<InvoiceSearchProps> = ({ 
  onCreateInvoice,
  searchQuery = "",
  setSearchQuery = () => {}
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative flex-1 md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search invoices..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Button onClick={onCreateInvoice}>
        <Plus className="mr-2 h-4 w-4" />
        Create Invoice
      </Button>
    </div>
  );
};

export default InvoiceSearch;
