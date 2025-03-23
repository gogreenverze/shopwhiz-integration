
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { Product } from "@/data/mockData";
import { PlusCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

const ProductCard = ({ product, onAddToCart, className }: ProductCardProps) => {
  return (
    <Card className={cn("overflow-hidden transition-all glass-card hover:shadow-lg", className)}>
      <div className="aspect-square overflow-hidden relative group">
        <img
          src={product.image || "https://placehold.co/400x400/e2e8f0/a0aec0?text=No+Image"}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
          <Button size="icon" variant="secondary" className="rounded-full w-10 h-10">
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="default" 
            className="rounded-full w-10 h-10" 
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            <PlusCircle className="w-4 h-4" />
          </Button>
        </div>

        {product.stock <= 5 && (
          <Badge 
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600" 
            variant="secondary"
          >
            Low Stock
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-1">
          <Badge variant="outline" className="text-xs font-normal">
            {product.category}
          </Badge>
        </div>
        <h3 className="font-medium text-md mt-1 truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="font-bold">{formatCurrency(product.price)}</span>
        <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
