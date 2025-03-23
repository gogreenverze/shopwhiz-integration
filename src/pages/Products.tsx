
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

const Products = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { t } = useLanguage();
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: mockCategories[0],
    description: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddProduct = () => {
    // Validation
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast.error(t("products.validation.required"));
      return;
    }
    
    // In a real app, we would add the product to the database
    toast.success(t("products.success.added", { name: newProduct.name }));
    setIsAddProductOpen(false);
    setNewProduct({
      name: "",
      price: "",
      stock: "",
      category: mockCategories[0],
      description: ""
    });
  };
  
  const handleEditProduct = (productId: string) => {
    toast.info(t("products.info.editing", { id: productId }));
  };
  
  const handleDeleteProduct = (productId: string) => {
    toast.success(t("products.success.deleted", { id: productId }));
  };
  
  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    toast.info(t("products.info.filtersApplied"));
  };
  
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
      header: t("products.table.name"),
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
      header: t("products.table.price"),
      cell: (product) => formatCurrency(product.price),
      sortable: true,
    },
    {
      id: "stock",
      header: t("products.table.stock"),
      cell: (product) => (
        <div className={`${product.stock <= 5 ? "text-red-500" : ""}`}>
          {product.stock}
        </div>
      ),
      sortable: true,
    },
    {
      id: "category",
      header: t("products.table.category"),
      cell: (product) => (
        <Badge variant="outline" className="text-xs font-normal">
          {product.category}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: "created",
      header: t("products.table.created"),
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
            onClick={() => handleEditProduct(product.id)}
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
        <h1 className="text-3xl font-bold tracking-tight">{t("products.title")}</h1>
        <p className="text-muted-foreground">
          {t("products.description")}
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t("products.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(true)}>
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
              <TabsTrigger value="all">{t("products.categories.all")}</TabsTrigger>
              {mockCategories.slice(0, 3).map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <Button className="ml-auto" onClick={() => setIsAddProductOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("products.actions.add")}
          </Button>
        </div>
      </div>
      
      {view === "grid" ? (
        filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onEdit={() => handleEditProduct(product.id)}
                onDelete={() => handleDeleteProduct(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 glass-card rounded-lg">
            <BarChart4 className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">{t("products.noResults")}</h3>
            <p className="text-muted-foreground text-center mt-2">
              {t("products.adjustSearch")}
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
      
      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("products.dialog.addTitle")}</DialogTitle>
            <DialogDescription>
              {t("products.dialog.addDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">{t("products.form.name")}</Label>
              <Input
                id="name"
                name="name"
                className="col-span-3"
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">{t("products.form.price")}</Label>
              <Input
                id="price"
                name="price"
                type="number"
                className="col-span-3"
                value={newProduct.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">{t("products.form.stock")}</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                className="col-span-3"
                value={newProduct.stock}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">{t("products.form.category")}</Label>
              <Tabs 
                defaultValue={mockCategories[0]} 
                className="col-span-3"
                onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}
              >
                <TabsList className="w-full grid grid-cols-3">
                  {mockCategories.slice(0, 3).map((cat) => (
                    <TabsTrigger key={cat} value={cat}>
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">{t("products.form.description")}</Label>
              <Input
                id="description"
                name="description"
                className="col-span-3"
                value={newProduct.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsAddProductOpen(false)}>
              {t("products.actions.cancel")}
            </Button>
            <Button type="button" onClick={handleAddProduct}>
              {t("products.actions.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{t("products.dialog.filterTitle")}</DialogTitle>
            <DialogDescription>
              {t("products.dialog.filterDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>{t("products.filter.price")}</Label>
              <div className="flex items-center gap-2">
                <Input placeholder={t("products.filter.min")} type="number" />
                <span>-</span>
                <Input placeholder={t("products.filter.max")} type="number" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("products.filter.stock")}</Label>
              <div className="flex items-center gap-2">
                <Input placeholder={t("products.filter.min")} type="number" />
                <span>-</span>
                <Input placeholder={t("products.filter.max")} type="number" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("products.filter.category")}</Label>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="all">{t("products.categories.all")}</TabsTrigger>
                  {mockCategories.slice(0, 3).map((cat) => (
                    <TabsTrigger key={cat} value={cat}>
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFilterOpen(false)}>
              {t("products.actions.reset")}
            </Button>
            <Button type="button" onClick={handleApplyFilters}>
              {t("products.actions.apply")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
