
import React from 'react';
import { mockCustomers, mockProducts } from "@/data/mockData";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, Plus, X } from "lucide-react";
import { useInvoiceForm } from "@/hooks/useInvoiceForm";

interface InvoiceFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formatCurrency: (value: number) => string;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
  isOpen, 
  onOpenChange,
  formatCurrency
}) => {
  const {
    formData,
    errors,
    handleChange,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    calculateTotal,
    handleSubmit
  } = useInvoiceForm(() => onOpenChange(false));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Create an invoice to send to your customer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">Customer</Label>
            <div className="col-span-3">
              <Select
                value={formData.customer}
                onValueChange={(value) => handleChange("customer", value)}
              >
                <SelectTrigger className={errors["customer"] ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Guest Customer</SelectItem>
                  {mockCustomers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors["customer"] && (
                <p className="text-sm text-red-500 mt-1">{errors["customer"]}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <div className="col-span-3">
              <Input
                id="email"
                placeholder="customer@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors["email"] ? "border-red-500" : ""}
              />
              {errors["email"] && (
                <p className="text-sm text-red-500 mt-1">{errors["email"]}</p>
              )}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Items</Label>
            
            {formData.items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <Select
                    value={item.product}
                    onValueChange={(value) => handleItemChange(index, "product", value)}
                  >
                    <SelectTrigger className={errors[`items[${index}].product`] ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {formatCurrency(product.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[`items[${index}].product`] && (
                    <p className="text-sm text-red-500 mt-1">{errors[`items[${index}].product`]}</p>
                  )}
                </div>
                
                <div className="w-20">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                    className={errors[`items[${index}].quantity`] ? "border-red-500" : ""}
                  />
                  {errors[`items[${index}].quantity`] && (
                    <p className="text-sm text-red-500 mt-1">{errors[`items[${index}].quantity`]}</p>
                  )}
                </div>
                
                <div className="w-24 text-right">
                  {formatCurrency(item.price * item.quantity)}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  disabled={formData.items.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button variant="outline" onClick={handleAddItem} className="mt-2">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            
            <div className="flex justify-between mt-4 font-medium">
              <span>Total</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">Notes</Label>
            <div className="col-span-3">
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Additional information or payment terms..."
                className={errors["notes"] ? "border-red-500" : ""}
              />
              {errors["notes"] && (
                <p className="text-sm text-red-500 mt-1">{errors["notes"]}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            <Check className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceForm;
