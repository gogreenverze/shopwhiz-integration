import { Product, Customer, Sale, SaleItem } from "@/data/mockData";

const API_URL = import.meta.env.PROD 
  ? '/api'  // In production, API requests will be proxied 
  : 'http://localhost:3001/api';  // In development, direct to local server

// Product API
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  
  return response.json();
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  
  return response.json();
};

export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
};

// Customer API
export const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await fetch(`${API_URL}/customers`);
  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }
  return response.json();
};

// Sales API
export const fetchSales = async (): Promise<Sale[]> => {
  const response = await fetch(`${API_URL}/sales`);
  if (!response.ok) {
    throw new Error('Failed to fetch sales');
  }
  return response.json();
};

export const createSale = async (sale: {
  items: Omit<SaleItem, 'total'>[];
  total: number;
  tax: number;
  grandTotal: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'cancelled';
  customerId?: string;
  customerName?: string;
}): Promise<Sale> => {
  // Calculate item totals if not provided
  const saleWithTotals = {
    ...sale,
    items: sale.items.map(item => ({
      ...item,
      total: item.unitPrice * item.quantity
    }))
  };

  const response = await fetch(`${API_URL}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(saleWithTotals),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create sale');
  }
  
  return response.json();
};

// Dashboard API
export interface SalesSummary {
  totalSales: number;
  totalTransactions: number;
  averageOrder: number;
  compareToLastPeriod: number;
}

export const getSalesSummary = async (timeRange: string): Promise<SalesSummary> => {
  try {
    const response = await fetch(`/api/dashboard/summary?timeRange=${timeRange}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard summary');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    // Fallback to mock data if API fails
    return {
      totalSales: 12580.75,
      totalTransactions: 145,
      averageOrder: 86.76,
      compareToLastPeriod: 12.4
    };
  }
};

export const getDailySales = async (days: number = 7) => {
  try {
    const response = await fetch(`/api/dashboard/dailySales?days=${days}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch daily sales data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    
    // Fallback data if API fails
    const fallbackData = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      fallbackData.push({
        date: date.toISOString().split('T')[0],
        total: Math.floor(Math.random() * 1000) + 500
      });
    }
    
    return fallbackData;
  }
};

// Settings API
export const getCurrency = async (): Promise<{currency: string}> => {
  const response = await fetch(`${API_URL}/settings/currency`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch currency setting');
  }
  
  return response.json();
};

export const setCurrency = async (currency: string): Promise<{currency: string}> => {
  const response = await fetch(`${API_URL}/settings/currency`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currency }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update currency setting');
  }
  
  return response.json();
};
