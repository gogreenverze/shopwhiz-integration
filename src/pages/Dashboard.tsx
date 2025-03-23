
import { useState } from "react";
import MetricsDisplay from "@/components/dashboard/MetricsDisplay";
import SalesChart from "@/components/dashboard/SalesChart";
import DataTable from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Package, ShoppingCart } from "lucide-react";
import { mockProducts, mockSales } from "@/data/mockData";
import { formatCurrency, formatDate, formatTime } from "@/utils/formatters";

const Dashboard = () => {
  const recentSalesColumns = [
    {
      id: "date",
      header: "Date & Time",
      cell: (sale) => (
        <div>
          <div className="font-medium">{formatDate(sale.createdAt)}</div>
          <div className="text-sm text-muted-foreground">{formatTime(sale.createdAt)}</div>
        </div>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      cell: (sale) => sale.customerName || "Guest",
    },
    {
      id: "items",
      header: "Items",
      cell: (sale) => sale.items.length,
    },
    {
      id: "status",
      header: "Status",
      cell: (sale) => (
        <Badge
          className={
            sale.status === "completed"
              ? "bg-green-500 hover:bg-green-600"
              : sale.status === "pending"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-red-500 hover:bg-red-600"
          }
        >
          {sale.status}
        </Badge>
      ),
    },
    {
      id: "total",
      header: "Total",
      cell: (sale) => (
        <div className="font-medium text-right">
          {formatCurrency(sale.grandTotal)}
        </div>
      ),
    },
  ];

  const popularProductsColumns = [
    {
      id: "product",
      header: "Product",
      cell: (product) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md overflow-hidden">
            <img
              src={product.image || "https://placehold.co/100/e2e8f0/a0aec0?text=No+Image"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">{product.category}</div>
          </div>
        </div>
      ),
    },
    {
      id: "price",
      header: "Price",
      cell: (product) => formatCurrency(product.price),
    },
    {
      id: "stock",
      header: "Stock",
      cell: (product) => (
        <div className={`${product.stock <= 5 ? "text-red-500" : ""}`}>
          {product.stock}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to your point of sale system.
        </p>
      </div>

      <MetricsDisplay />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SalesChart className="md:col-span-2" />

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {[
                {
                  icon: <ShoppingCart className="w-4 h-4" />,
                  title: "New order #12345",
                  time: "Just now",
                  amount: "$58.29",
                },
                {
                  icon: <Heart className="w-4 h-4" />,
                  title: "New customer registered",
                  time: "2 hours ago",
                  user: "John Doe",
                },
                {
                  icon: <Package className="w-4 h-4" />,
                  title: "Stock alert",
                  time: "5 hours ago",
                  product: "Coffee - Premium Blend",
                },
                {
                  icon: <ShoppingCart className="w-4 h-4" />,
                  title: "New order #12344",
                  time: "8 hours ago",
                  amount: "$34.78",
                },
              ].map((activity, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {activity.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{activity.time}</span>
                      {activity.amount && (
                        <Badge className="ml-2" variant="secondary">
                          {activity.amount}
                        </Badge>
                      )}
                      {activity.user && (
                        <span className="ml-2 text-primary">{activity.user}</span>
                      )}
                      {activity.product && (
                        <span className="ml-2 text-yellow-500">{activity.product}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="ghost" size="sm" className="w-full">
              View all activity
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={mockSales} columns={recentSalesColumns} />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Popular Products</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={mockProducts.slice(0, 5)} columns={popularProductsColumns} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
