import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { BarChart, LayoutDashboard, Menu, Package, Receipt, Settings, ShoppingCart, Users, FileText } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode } = useTheme();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Point of Sale", path: "/pos", icon: <ShoppingCart size={20} /> },
    { name: "Products", path: "/products", icon: <Package size={20} /> },
    { name: "Sales", path: "/sales", icon: <Receipt size={20} /> },
    { name: "Reports", path: "/reports", icon: <BarChart size={20} /> },
    { name: "Customers", path: "/customers", icon: <Users size={20} /> },
    { name: "Invoices", path: "/invoices", icon: <FileText size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const SidebarContent = () => (
    <div className={cn("flex h-full flex-col gap-2", className)}>
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xl">SmartShop</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors",
                location.pathname === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              Need help?
            </p>
            <p className="text-xs text-muted-foreground">
              Check our documentation
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden h-screen border-r lg:block w-64 sticky top-0">
        <SidebarContent />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed left-4 top-4 z-40"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
