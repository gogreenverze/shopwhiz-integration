import { generateId } from "@/utils/formatters";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  barcode?: string;
  sold?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  totalSpent: number;
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  productName: string;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  tax: number;
  grandTotal: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'cancelled';
  customerId?: string;
  customerName?: string;
  createdAt: Date;
}

export interface DailySales {
  date: string;
  total: number;
}

export const mockProducts: Product[] = [
  {
    id: generateId(),
    name: "Coffee - Premium Blend",
    description: "100% Arabica specialty coffee from Ethiopia",
    price: 12.99,
    stock: 45,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&h=400&auto=format&fit=crop",
    barcode: "1234567890123",
    sold: 35,
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 1, 15),
  },
  {
    id: generateId(),
    name: "Ceramic Mug - White",
    description: "Classic white ceramic coffee mug with minimalist design",
    price: 8.99,
    stock: 32,
    category: "Merchandise",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=400&h=400&auto=format&fit=crop",
    sold: 24,
    createdAt: new Date(2023, 2, 10),
    updatedAt: new Date(2023, 2, 10),
  },
  {
    id: generateId(),
    name: "Croissant - Butter",
    description: "Freshly baked buttery croissant",
    price: 3.49,
    stock: 18,
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&h=400&auto=format&fit=crop",
    sold: 45,
    createdAt: new Date(2023, 3, 5),
    updatedAt: new Date(2023, 3, 5),
  },
  {
    id: generateId(),
    name: "Tea - Earl Grey",
    description: "Premium loose leaf Earl Grey tea",
    price: 9.99,
    stock: 27,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?q=80&w=400&h=400&auto=format&fit=crop",
    sold: 18,
    createdAt: new Date(2023, 3, 12),
    updatedAt: new Date(2023, 3, 12),
  },
  {
    id: generateId(),
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie with walnuts",
    price: 4.99,
    stock: 15,
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=400&h=400&auto=format&fit=crop",
    sold: 30,
    createdAt: new Date(2023, 4, 2),
    updatedAt: new Date(2023, 4, 2),
  },
  {
    id: generateId(),
    name: "Tote Bag - Canvas",
    description: "Eco-friendly canvas tote bag with logo",
    price: 14.99,
    stock: 20,
    category: "Merchandise",
    image: "https://images.unsplash.com/photo-1592910147752-a96b0ac9cb3e?q=80&w=400&h=400&auto=format&fit=crop",
    sold: 12,
    createdAt: new Date(2023, 4, 20),
    updatedAt: new Date(2023, 4, 20),
  },
];

export const mockCustomers: Customer[] = [
  {
    id: generateId(),
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, CA 12345",
    totalSpent: 345.87,
    totalOrders: 12,
    createdAt: new Date(2023, 0, 10),
    updatedAt: new Date(2023, 0, 10),
  },
  {
    id: generateId(),
    name: "Samantha Lee",
    email: "samantha.lee@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Somewhere, NY 67890",
    notes: "Prefers oat milk",
    totalSpent: 287.25,
    totalOrders: 9,
    createdAt: new Date(2023, 1, 20),
    updatedAt: new Date(2023, 1, 20),
  },
  {
    id: generateId(),
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "555-456-7890",
    totalSpent: 156.50,
    totalOrders: 5,
    createdAt: new Date(2023, 2, 15),
    updatedAt: new Date(2023, 2, 15),
  },
  {
    id: generateId(),
    name: "Emily Williams",
    email: "emily.williams@example.com",
    phone: "555-789-0123",
    address: "789 Pine Rd, Elsewhere, FL 34567",
    notes: "Birthday: July 14",
    totalSpent: 523.12,
    totalOrders: 18,
    createdAt: new Date(2023, 3, 5),
    updatedAt: new Date(2023, 3, 5),
  },
];

export const mockSales: Sale[] = [
  {
    id: generateId(),
    items: [
      { 
        productId: mockProducts[0].id, 
        productName: mockProducts[0].name, 
        quantity: 2, 
        unitPrice: mockProducts[0].price, 
        total: mockProducts[0].price * 2 
      },
      { 
        productId: mockProducts[2].id, 
        productName: mockProducts[2].name, 
        quantity: 1, 
        unitPrice: mockProducts[2].price, 
        total: mockProducts[2].price 
      },
    ],
    total: mockProducts[0].price * 2 + mockProducts[2].price,
    tax: (mockProducts[0].price * 2 + mockProducts[2].price) * 0.08,
    grandTotal: (mockProducts[0].price * 2 + mockProducts[2].price) * 1.08,
    paymentMethod: "Credit Card",
    status: "completed",
    customerId: mockCustomers[0].id,
    customerName: mockCustomers[0].name,
    createdAt: new Date(2023, 5, 20, 15, 30),
  },
  {
    id: generateId(),
    items: [
      { 
        productId: mockProducts[3].id, 
        productName: mockProducts[3].name, 
        quantity: 1, 
        unitPrice: mockProducts[3].price, 
        total: mockProducts[3].price 
      },
      { 
        productId: mockProducts[4].id, 
        productName: mockProducts[4].name, 
        quantity: 2, 
        unitPrice: mockProducts[4].price, 
        total: mockProducts[4].price * 2 
      },
    ],
    total: mockProducts[3].price + mockProducts[4].price * 2,
    tax: (mockProducts[3].price + mockProducts[4].price * 2) * 0.08,
    grandTotal: (mockProducts[3].price + mockProducts[4].price * 2) * 1.08,
    paymentMethod: "Cash",
    status: "completed",
    customerId: mockCustomers[1].id,
    customerName: mockCustomers[1].name,
    createdAt: new Date(2023, 5, 21, 10, 15),
  },
  {
    id: generateId(),
    items: [
      { 
        productId: mockProducts[1].id, 
        productName: mockProducts[1].name, 
        quantity: 1, 
        unitPrice: mockProducts[1].price, 
        total: mockProducts[1].price 
      },
      { 
        productId: mockProducts[5].id, 
        productName: mockProducts[5].name, 
        quantity: 1, 
        unitPrice: mockProducts[5].price, 
        total: mockProducts[5].price 
      },
    ],
    total: mockProducts[1].price + mockProducts[5].price,
    tax: (mockProducts[1].price + mockProducts[5].price) * 0.08,
    grandTotal: (mockProducts[1].price + mockProducts[5].price) * 1.08,
    paymentMethod: "Mobile Payment",
    status: "completed",
    createdAt: new Date(2023, 5, 21, 14, 45),
  },
  {
    id: generateId(),
    items: [
      { 
        productId: mockProducts[0].id, 
        productName: mockProducts[0].name, 
        quantity: 3, 
        unitPrice: mockProducts[0].price, 
        total: mockProducts[0].price * 3 
      },
    ],
    total: mockProducts[0].price * 3,
    tax: (mockProducts[0].price * 3) * 0.08,
    grandTotal: (mockProducts[0].price * 3) * 1.08,
    paymentMethod: "Credit Card",
    status: "completed",
    customerId: mockCustomers[2].id,
    customerName: mockCustomers[2].name,
    createdAt: new Date(2023, 5, 22, 9, 30),
  },
];

export const mockDailySales: DailySales[] = [
  { date: "2023-05-16", total: 423.50 },
  { date: "2023-05-17", total: 512.75 },
  { date: "2023-05-18", total: 387.20 },
  { date: "2023-05-19", total: 541.30 },
  { date: "2023-05-20", total: 629.45 },
  { date: "2023-05-21", total: 487.90 },
  { date: "2023-05-22", total: 573.60 },
];

export const mockCategories = [
  "Beverages",
  "Bakery",
  "Merchandise",
  "Snacks",
  "Dairy",
  "Produce",
];

export const mockPaymentMethods = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Mobile Payment",
  "Gift Card",
];

export type TimeRange = "today" | "yesterday" | "last7days" | "last30days" | "thisMonth" | "lastMonth";

export interface SalesSummary {
  totalSales: number;
  totalTransactions: number;
  averageOrder: number;
  compareToLastPeriod: number;
}

export const getSalesSummary = (timeRange: TimeRange): SalesSummary => {
  switch (timeRange) {
    case "today":
      return { 
        totalSales: 573.60, 
        totalTransactions: 12, 
        averageOrder: 47.80, 
        compareToLastPeriod: 5.2 
      };
    case "yesterday":
      return { 
        totalSales: 487.90, 
        totalTransactions: 10, 
        averageOrder: 48.79, 
        compareToLastPeriod: -8.3 
      };
    case "last7days":
      return { 
        totalSales: 3555.70, 
        totalTransactions: 83, 
        averageOrder: 42.84, 
        compareToLastPeriod: 12.7 
      };
    case "last30days":
      return { 
        totalSales: 14275.40, 
        totalTransactions: 341, 
        averageOrder: 41.86, 
        compareToLastPeriod: 7.8 
      };
    case "thisMonth":
      return { 
        totalSales: 8734.20, 
        totalTransactions: 215, 
        averageOrder: 40.62, 
        compareToLastPeriod: 4.2 
      };
    case "lastMonth":
      return { 
        totalSales: 12450.70, 
        totalTransactions: 298, 
        averageOrder: 41.78, 
        compareToLastPeriod: 2.5 
      };
    default:
      return { 
        totalSales: 0, 
        totalTransactions: 0, 
        averageOrder: 0, 
        compareToLastPeriod: 0 
      };
  }
};
