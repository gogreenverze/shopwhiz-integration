
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  Search, 
  Menu, 
  X,
  Moon,
  Sun,
  Terminal
} from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="glass-panel border-b border-border h-16 px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40 animate-fade-in">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="mr-2 lg:hidden transition-transform duration-200"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        
        <div className="hidden md:flex items-center w-72 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search..." 
            className="pl-9 bg-background/50 border-none focus-visible:ring-1"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="animate-pulse-subtle">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 transition-transform hover:scale-105">
            <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&auto=format&fit=crop" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
