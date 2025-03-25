
import React, { useState } from 'react';
import { mockCustomers, mockProducts } from "@/data/mockData";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, Plus, X } from "lucide-react";
import { toast } from "sonner";

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
  const [newInvoice, setNewInvoice] = useState({
    customer: "",
    email: "",
    items: [{ product: "", quantity: 1, price: 0 }],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    notes: ""
  });

  const handleAddItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { product: "", quantity: 1, price: 0 }]
    });
  };

  const handleRemoveItem = (index: number) => {
    const items = [...newInvoice.items];
    items.splice(index, 1);
    setNewInvoice({ ...newInvoice, items });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const items = [...newInvoice.items];
    
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
    
    setNewInvoice({ ...newInvoice, items });
  };

  const calculateTotal = () => {
    return newInvoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCreateInvoice = () => {
    if (newInvoice.items.some(item => !item.product)) {
      toast.error("Please select products for all items");
      return;
    }
    
    toast.success("Invoice created successfully");
    onOpenChange(false);
    setNewInvoice({
      customer: "",
      email: "",
      items: [{ product: "", quantity: 1, price: 0 }],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: ""
    });
  };

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
            <Select
              value={newInvoice.customer}
              onValueChange={(value) => setNewInvoice({...newInvoice, customer: value})}
            >
              <SelectTrigger className="col-span-3">
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
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input
              id="email"
              placeholder="customer@example.com"
              className="col-span-3"
              value={newInvoice.email}
              onChange={(e) => setNewInvoice({...newInvoice, email: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Items</Label>
            
            {newInvoice.items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={item.product}
                  onValueChange={(value) => handleItemChange(index, "product", value)}
                >
                  <SelectTrigger className="flex-1">
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
                
                <Input
                  type="number"
                  min="1"
                  className="w-20"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                />
                
                <div className="w-24 text-right">
                  {formatCurrency(item.price * item.quantity)}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  disabled={newInvoice.items.length === 1}
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
            <Textarea
              id="notes"
              className="col-span-3"
              value={newInvoice.notes}
              onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
              placeholder="Additional information or payment terms..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCreateInvoice}>
            <Check className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceForm;
