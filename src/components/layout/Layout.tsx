
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Terminal } from "lucide-react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="animate-pulse-subtle">
            <Terminal className="w-12 h-12 text-primary mb-4" />
          </div>
          <div className="h-2 w-24 bg-muted rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile sidebar with overlay */}
      <div className="lg:hidden">
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar open={true} onClose={() => {}} />
      </div>
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen} 
        />
        
        <main className="flex-1 pt-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
