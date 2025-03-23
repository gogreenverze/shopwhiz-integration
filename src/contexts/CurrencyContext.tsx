
import React, { createContext, useContext, useState, useEffect } from "react";

// Currency type with code, symbol and name
export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

// List of world currencies
export const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "MXN", symbol: "Mex$", name: "Mexican Peso" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
];

// Currency context type
type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
};

// Create context with default values
const CurrencyContext = createContext<CurrencyContextType>({
  currency: currencies[0], // Default to USD
  setCurrency: () => {},
  formatCurrency: (amount) => `$${amount.toFixed(2)}`,
});

// Provider component
export const CurrencyProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    // Load currency from localStorage or use default
    const savedCurrency = localStorage.getItem("currencyCode");
    if (savedCurrency) {
      const foundCurrency = currencies.find(c => c.code === savedCurrency);
      if (foundCurrency) return foundCurrency;
    }
    return currencies[0]; // Default to USD
  });

  // Update currency in localStorage when it changes
  useEffect(() => {
    localStorage.setItem("currencyCode", currency.code);
  }, [currency]);

  // Function to format amounts according to the selected currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use the currency context
export const useCurrency = () => useContext(CurrencyContext);
