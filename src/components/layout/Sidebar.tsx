
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Receipt,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  BarChart4,
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && open) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open, onClose]);

  useEffect(() => {
    if (window.innerWidth < 1024 && open) {
      onClose();
    }
  }, [location.pathname, open, onClose]);

  if (!mounted) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-sidebar text-sidebar-foreground z-50 w-64 pt-16 flex flex-col border-r border-border transition-transform duration-300 ease-spring",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          <div className="flex items-center justify-center my-4">
            <div className="flex items-center space-x-2 bg-sidebar-accent py-2 px-3 rounded-lg">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg">ShopOS</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            <NavItem
              to="/"
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Dashboard"
              active={isActive("/")}
            />
            <NavItem
              to="/pos"
              icon={<ShoppingBag className="w-5 h-5" />}
              label="Point of Sale"
              active={isActive("/pos")}
            />
            <NavItem
              to="/products"
              icon={<BarChart4 className="w-5 h-5" />}
              label="Products"
              active={isActive("/products")}
            />
            <NavItem
              to="/customers"
              icon={<Users className="w-5 h-5" />}
              label="Customers"
              active={isActive("/customers")}
            />
            <NavItem
              to="/sales"
              icon={<Receipt className="w-5 h-5" />}
              label="Sales"
              active={isActive("/sales")}
            />
            <NavItem
              to="/invoices"
              icon={<FileText className="w-5 h-5" />}
              label="Invoices"
              active={isActive("/invoices")}
            />
          </nav>

          <Separator className="my-6 bg-sidebar-border" />

          <nav className="space-y-1.5">
            <NavItem
              to="/settings"
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              active={isActive("/settings")}
            />
          </nav>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground">
            <LogOut className="w-5 h-5 mr-2" />
            <span>Log out</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={cn(
        "flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative group",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-all",
          active ? "opacity-100" : "opacity-0"
        )}
      />
      <span
        className={cn(
          "transition-colors",
          active && "text-primary"
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
      <ChevronRight 
        className={cn(
          "w-4 h-4 ml-auto opacity-0 group-hover:opacity-70 transition-opacity", 
          active && "opacity-70"
        )} 
      />
    </NavLink>
  );
};

export default Sidebar;
