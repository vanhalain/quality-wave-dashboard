
import { BarChart3, FileText, Home, Settings, Users, Grid, PenSquare, Languages } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import React from 'react';
import { useLanguage } from '@/lib/language-context';

interface SidebarNavProps {
  collapsed: boolean;
}

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    {
      name: t('Dashboard'),
      href: '/',
      icon: Home,
    },
    {
      name: t('Campaigns'),
      href: '/campaigns',
      icon: FileText,
    },
    {
      name: t('Evaluations'),
      href: '/evaluations',
      icon: BarChart3,
    },
    {
      name: t('Grids'),
      href: '/grids',
      icon: Grid,
      submenu: [
        {
          name: t('List of grids'),
          href: '/grids',
          icon: Grid,
        },
        {
          name: t('Grid Creator'),
          href: '/grids/editor',
          icon: PenSquare,
        },
      ],
    },
    {
      name: t('Users'),
      href: '/users',
      icon: Users,
    },
    {
      name: t('Settings'),
      href: '/settings',
      icon: Settings,
      submenu: [
        {
          name: t('User Management'),
          href: '/settings',
          icon: Users,
        },
        {
          name: t('Translation Manager'),
          href: '/translations',
          icon: Languages,
        },
      ],
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
              {item.submenu && !collapsed ? (
                <div className="mb-1">
                  <div 
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent/30",
                      (location.pathname === item.href || item.submenu.some(sub => location.pathname.startsWith(sub.href)))
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : ""
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-3">{item.name}</span>
                  </div>
                  <ul className="mt-1 ml-6 space-y-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.href}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md transition-colors text-sm",
                            location.pathname === subItem.href || 
                            (subItem.href !== '/grids' && location.pathname.startsWith(subItem.href))
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/30"
                          )}
                        >
                          <subItem.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="ml-2">{subItem.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.href || 
                    (item.submenu && item.submenu.some(sub => location.pathname.startsWith(sub.href)))
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
