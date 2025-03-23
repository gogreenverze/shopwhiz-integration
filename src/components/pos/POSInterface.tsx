
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatters";
import { mockCategories, mockPaymentMethods, mockProducts, Product } from "@/data/mockData";
import { Trash2, Search, ShoppingCart, Plus, Minus, CreditCard, Printer, Save } from "lucide-react";
import ProductCard from "../products/ProductCard";
import { toast } from "sonner";

interface CartItem {
  product: Product;
  quantity: number;
}

const POSInterface = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [paymentMethod, setPaymentMethod] = useState<string>(mockPaymentMethods[0]);
  
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
    
    toast.success(`${product.name} added to cart`);
  };
  
  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };
  
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    toast.success("Order completed successfully!");
    setCart([]);
  };
  
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.barcode?.includes(searchQuery)
      : true;
    
    const matchesCategory = category === "all" || product.category === category;
    
    return matchesSearch && matchesCategory;
  });
  
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  const taxRate = 0.08; // 8%
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products or scan barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
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
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 glass-card rounded-lg">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-muted-foreground text-center mt-2">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>
      
      {/* Cart */}
      <div className="glass-card border border-border rounded-lg overflow-hidden flex flex-col h-[calc(100vh-11rem)]">
        <CardHeader className="px-6 py-4 flex flex-row items-center justify-between space-y-0 bg-muted/30">
          <CardTitle className="text-xl font-semibold flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Current Order
          </CardTitle>
          {cart.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCart([])}
              className="h-8 px-2 text-muted-foreground hover:text-destructive"
            >
              Clear
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="p-0 overflow-auto flex-grow">
          {cart.length > 0 ? (
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.product.id} className="p-4 hover:bg-muted/20">
                  <div className="flex justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.product.price)} each
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveFromCart(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() =>
                          handleUpdateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="w-10 text-center">{item.quantity}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() =>
                          handleUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-muted-foreground mt-2 max-w-[200px]">
                Add products from the left panel to start a new order
              </p>
            </div>
          )}
        </CardContent>
        
        <div className="mt-auto">
          <div className="p-4 bg-muted/30">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          
          <CardFooter className="flex flex-col p-4 space-y-4 bg-background/50 border-t border-border">
            <div className="grid grid-cols-3 gap-2 w-full">
              {mockPaymentMethods.slice(0, 3).map((method) => (
                <Button
                  key={method}
                  variant={paymentMethod === method ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setPaymentMethod(method)}
                >
                  {method === "Credit Card" && <CreditCard className="w-4 h-4 mr-2" />}
                  {method}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.info("Receipt saved")}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.info("Receipt printed")}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
            
            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              {cart.length > 0
                ? `Pay ${formatCurrency(total)}`
                : "Add items to cart"}
            </Button>
          </CardFooter>
        </div>
      </div>
    </div>
  );
};

export default POSInterface;
