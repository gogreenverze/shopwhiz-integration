
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { mockProducts } from "@/data/mockData";
import { z } from "zod";

// Define schema for validation
const saleItemSchema = z.object({
  product: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be at least 0"),
});

const saleSchema = z.object({
  customer: z.string(),
  items: z.array(saleItemSchema).min(1, "At least one item is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
});

type SaleItem = {
  product: string;
  quantity: number;
  price: number;
};

type SaleFormData = {
  customer: string;
  items: SaleItem[];
  paymentMethod: string;
  notes: string;
};

export const useSalesForm = (onComplete?: () => void) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SaleFormData>({
    customer: "",
    items: [{ product: "", quantity: 1, price: 0 }],
    paymentMethod: "cash",
    notes: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: "", quantity: 1, price: 0 }]
    });
  };

  const handleRemoveItem = (index: number) => {
    const items = [...formData.items];
    items.splice(index, 1);
    setFormData({ ...formData, items });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const items = [...formData.items];
    
    if (field === "product" && value) {
      const product = mockProducts.find(p => p.id === value);
      if (product) {
        items[index] = {
          ...items[index],
          [field]: value,
          price: product.price
        };
      }
    } else {
      items[index] = { ...items[index], [field]: value };
    }
    
    setFormData({ ...formData, items });
    
    // Clear error for this field if it exists
    if (errors[`items[${index}].${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`items[${index}].${field}`];
      setErrors(newErrors);
    }
  };

  const handleChange = (field: keyof SaleFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error for this field if it exists
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const validateForm = (): boolean => {
    try {
      // Validate each item first
      const itemErrors: Record<string, string> = {};
      formData.items.forEach((item, index) => {
        try {
          saleItemSchema.parse(item);
        } catch (error) {
          if (error instanceof z.ZodError) {
            error.errors.forEach(err => {
              const field = `items[${index}].${err.path[0]}`;
              itemErrors[field] = err.message;
            });
          }
        }
      });

      // Now validate the whole form
      saleSchema.parse(formData);
      
      // If we have item errors, set them even if the schema passes
      if (Object.keys(itemErrors).length > 0) {
        setErrors(itemErrors);
        return false;
      }
      
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path.join('.')] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Sale created successfully"
    });
    
    // Reset form
    setFormData({
      customer: "",
      items: [{ product: "", quantity: 1, price: 0 }],
      paymentMethod: "cash",
      notes: ""
    });
    
    if (onComplete) {
      onComplete();
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    calculateTotal,
    handleSubmit
  };
};
