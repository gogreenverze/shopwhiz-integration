
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

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
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
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

import { Terminal } from "lucide-react";

export default Layout;
