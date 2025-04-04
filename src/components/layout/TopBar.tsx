
import { Bell, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopBarProps {
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function TopBar({ toggleSidebar, sidebarCollapsed }: TopBarProps) {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
          {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
        <div className="md:flex items-center hidden md:w-72">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="h-9 md:w-64 bg-muted/30 border-0 focus-visible:ring-0" 
          />
        </div>
      </div>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
      </div>
    </div>
  );
}
