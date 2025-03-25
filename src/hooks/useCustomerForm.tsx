
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";

// Define schema for validation
const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
};

export const useCustomerForm = (onComplete?: () => void) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof CustomerFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error for this field if it exists
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    try {
      customerSchema.parse(formData);
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
      description: "Customer added successfully"
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
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
    handleSubmit
  };
};
