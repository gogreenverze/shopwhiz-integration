
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockCustomers } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/utils/formatters";
import DataTable from "@/components/ui/DataTable";
import { Plus, Mail, Phone, MapPin, FileEdit, Trash, UserPlus, User } from "lucide-react";
import { toast } from "sonner";

const Customers = () => {
  const columns = [
    {
      id: "name",
      header: "Customer",
      cell: (customer) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={`https://avatar.vercel.sh/${customer.id}`} />
            <AvatarFallback>
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{customer.name}</div>
            <div className="text-sm text-muted-foreground">Customer ID: {customer.id.substring(0, 8)}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      id: "contact",
      header: "Contact",
      cell: (customer) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Mail className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
            {customer.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
            {customer.phone}
          </div>
          {customer.address && (
            <div className="flex items-center text-sm">
              <MapPin className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <span className="truncate max-w-[200px]">{customer.address}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "orders",
      header: "Orders",
      cell: (customer) => (
        <Badge variant="outline" className="text-sm font-normal">
          {customer.totalOrders}
        </Badge>
      ),
      sortable: true,
    },
    {
      id: "spent",
      header: "Total Spent",
      cell: (customer) => formatCurrency(customer.totalSpent),
      sortable: true,
    },
    {
      id: "created",
      header: "Created",
      cell: (customer) => formatDate(customer.createdAt),
      sortable: true,
    },
    {
      id: "actions",
      header: "",
      cell: (customer) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => toast.info(`Editing ${customer.name}`)}
          >
            <FileEdit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => toast.error(`Delete operation canceled`)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          View and manage your customer relationships and data.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCustomers.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 in the last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Spend</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                mockCustomers.reduce((acc, c) => acc + c.totalSpent, 0) /
                  mockCustomers.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Per customer lifetime
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCustomers.filter((c) => c.totalOrders > 1).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((mockCustomers.filter((c) => c.totalOrders > 1).length /
                mockCustomers.length) *
                100).toFixed(1)}
              % of total
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                mockCustomers.reduce((acc, c) => acc + c.totalSpent, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime customer value
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Customer List</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <DataTable data={mockCustomers} columns={columns} searchField="name" />
    </div>
  );
};

export default Customers;
