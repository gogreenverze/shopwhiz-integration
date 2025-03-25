
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface SalesHeaderProps {
  onCreateSale: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SalesHeader: React.FC<SalesHeaderProps> = ({ 
  onCreateSale, 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
        <p className="text-muted-foreground">
          View and manage sales transactions.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search sales..." 
            className="pl-9" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button onClick={onCreateSale}>
          <Plus className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </div>
    </div>
  );
};

export default SalesHeader;
