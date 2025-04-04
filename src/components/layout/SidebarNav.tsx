
import { BarChart3, FileText, Home, Settings, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  collapsed: boolean;
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const location = useLocation();
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
    },
    {
      name: 'Campaigns',
      href: '/campaigns',
      icon: FileText,
    },
    {
      name: 'Evaluations',
      href: '/evaluations',
      icon: BarChart3,
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <div 
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col h-screen transition-all duration-300 border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-center border-b border-sidebar-border">
        {!collapsed ? (
          <h1 className="text-xl font-bold text-white">AcQuality</h1>
        ) : (
          <h1 className="text-xl font-bold text-white">AQ</h1>
        )}
      </div>
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  location.pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-white font-medium">U</span>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-sidebar-foreground">User Name</p>
              <p className="text-xs text-sidebar-foreground/70">Administrator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
