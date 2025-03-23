
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MoreHorizontal, 
  BarChart4 
} from "lucide-react";
import { mockCategories, mockProducts } from "@/data/mockData";
import DataTable from "@/components/ui/DataTable";
import ProductCard from "@/components/products/ProductCard";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { toast } from "sonner";

const Products = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = category === "all" || product.category === category;
    
    return matchesSearch && matchesCategory;
  });
  
  const columns = [
    {
      id: "name",
      header: "Name",
      cell: (product) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md overflow-hidden">
            <img
              src={product.image || "https://placehold.co/100/e2e8f0/a0aec0?text=No+Image"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">{product.category}</div>
          </div>
        </div>
      ),
    },
    {
      id: "price",
      header: "Price",
      cell: (product) => formatCurrency(product.price),
      sortable: true,
    },
    {
      id: "stock",
      header: "Stock",
      cell: (product) => (
        <div className={`${product.stock <= 5 ? "text-red-500" : ""}`}>
          {product.stock}
        </div>
      ),
      sortable: true,
    },
    {
      id: "category",
      header: "Category",
      cell: (product) => (
        <Badge variant="outline" className="text-xs font-normal">
          {product.category}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: "created",
      header: "Created",
      cell: (product) => formatDate(product.createdAt),
      sortable: true,
    },
    {
      id: "actions",
      header: "",
      cell: (product) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => toast.info(`Editing ${product.name}`)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  
  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your inventory, edit products, and track stock levels.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView(view === "grid" ? "list" : "grid")}
          >
            {view === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid3X3 className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Tabs
            value={category}
            onValueChange={setCategory}
            className="w-full md:w-auto"
          >
            <TabsList className="w-full grid grid-cols-4 h-10">
              <TabsTrigger value="all">All</TabsTrigger>
              {mockCategories.slice(0, 3).map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <Button className="ml-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
      
      {view === "grid" ? (
        filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 glass-card rounded-lg">
            <BarChart4 className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-muted-foreground text-center mt-2">
              Try adjusting your search or category filter
            </p>
          </div>
        )
      ) : (
        <DataTable
          data={filteredProducts}
          columns={columns}
          searchField="name"
        />
      )}
    </div>
  );
};

export default Products;
