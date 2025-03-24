
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReportTableProps {
  data: any[];
  type: "sales" | "products";
  formatCurrency: (value: number, options?: any) => string;
  formatDate?: (date: string) => string;
}

const ReportTable = ({ data, type, formatCurrency, formatDate }: ReportTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredData = data.filter(item => {
    if (!searchQuery) return true;
    
    if (type === "sales") {
      return (
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.customerName && item.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    } else {
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder={`Search ${type}...`} 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            {type === "sales" ? (
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            ) : (
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Sold</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {type === "sales" ? (
              filteredData.length > 0 ? (
                filteredData.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.id}</TableCell>
                    <TableCell>{formatDate ? formatDate(sale.createdAt) : sale.createdAt}</TableCell>
                    <TableCell>{sale.customerName || "Guest"}</TableCell>
                    <TableCell>{sale.items.length}</TableCell>
                    <TableCell>{formatCurrency(sale.grandTotal)}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          sale.status === "completed"
                            ? "bg-green-500 hover:bg-green-600"
                            : sale.status === "pending"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-red-500 hover:bg-red-600"
                        )}
                      >
                        {sale.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No sales data found</TableCell>
                </TableRow>
              )
            ) : (
              filteredData.length > 0 ? (
                filteredData.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <span className={product.stock <= 5 ? "text-red-500 font-medium" : ""}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>{product.sold || 0}</TableCell>
                    <TableCell>{formatCurrency(product.price * (product.sold || 0))}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No products found</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportTable;
