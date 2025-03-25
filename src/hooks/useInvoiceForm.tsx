
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { mockProducts, mockCustomers } from "@/data/mockData";
import { z } from "zod";

// Define schema for validation
const invoiceItemSchema = z.object({
  product: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be at least 0"),
});

const invoiceSchema = z.object({
  customer: z.string(),
  email: z.string().email().optional().or(z.literal("")),
  items: z.array(invoiceItemSchema).min(1),
  dueDate: z.date(),
  notes: z.string().optional(),
});

type InvoiceItem = {
  product: string;
  quantity: number;
  price: number;
};

type InvoiceFormData = {
  customer: string;
  email: string;
  items: InvoiceItem[];
  dueDate: Date;
  notes: string;
};

export const useInvoiceForm = (onComplete?: () => void) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InvoiceFormData>({
    customer: "",
    email: "",
    items: [{ product: "", quantity: 1, price: 0 }],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
  };

  const handleChange = (field: keyof InvoiceFormData, value: any) => {
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
          invoiceItemSchema.parse(item);
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
      invoiceSchema.parse(formData);
      
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
      description: "Invoice created successfully"
    });
    
    // Reset form
    setFormData({
      customer: "",
      email: "",
      items: [{ product: "", quantity: 1, price: 0 }],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
