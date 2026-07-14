'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  Search,
  PlusCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Bus,
  Bell,
  HelpCircle,
  Settings,
  BarChart2,
  Users,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const primaryNav: NavItem[] = [
  {
    id: 'nav-fare-search',
    label: 'Fare Search',
    href: '/',
    icon: <Search size={18} />,
  },
  {
    id: 'nav-fare-contribution',
    label: 'Contribute Fare',
    href: '/fare-contribution',
    icon: <PlusCircle size={18} />,
    badge: 0,
  },
  {
    id: 'nav-fare-tracker',
    label: 'Fare Tracker',
    href: '/fare-tracker',
    icon: <TrendingUp size={18} />,
    badge: 3,
  },
];

const secondaryNav: NavItem[] = [
  {
    id: 'nav-agencies',
    label: 'Agencies',
    href: '#',
    icon: <Bus size={18} />,
  },
  {
    id: 'nav-alerts',
    label: 'Fare Alerts',
    href: '#',
    icon: <Bell size={18} />,
    badge: 5,
  },
  {
    id: 'nav-stats',
    label: 'Statistics',
    href: '#',
    icon: <BarChart2 size={18} />,
  },
  {
    id: 'nav-contributors',
    label: 'Contributors',
    href: '#',
    icon: <Users size={18} />,
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-card border-r border-border shadow-sidebar z-30 flex flex-col sidebar-transition ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center border-b border-border h-16 px-3 ${
          collapsed ? 'justify-center' : 'gap-2 px-4'
        }`}
      >
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-semibold text-base text-foreground tracking-tight">
            FareTrack
          </span>
        )}
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-2 space-y-1">
        {!collapsed && (
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-2 mb-2">
            Navigation
          </p>
        )}
        {primaryNav.map((item) => (
          <NavLink
            key={item.id}
            item={item}
            collapsed={collapsed}
            active={isActive(item.href)}
          />
        ))}

        <div className="pt-4">
          {!collapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-2 mb-2">
              Explore
            </p>
          )}
          {!collapsed && <div className="border-t border-border mb-3" />}
          {secondaryNav.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              collapsed={collapsed}
              active={isActive(item.href)}
            />
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-border px-2 py-3 space-y-1">
        <NavLink
          item={{ id: 'nav-help', label: 'Help & Docs', href: '#', icon: <HelpCircle size={18} /> }}
          collapsed={collapsed}
          active={false}
        />
        <NavLink
          item={{ id: 'nav-settings', label: 'Settings', href: '#', icon: <Settings size={18} /> }}
          collapsed={collapsed}
          active={false}
        />

        {/* User */}
        <div
          className={`flex items-center gap-3 mt-2 px-2 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
            MR
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Marcus Rivera</p>
              <p className="text-xs text-muted-foreground truncate">Contributor</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors z-40"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight size={12} className="text-muted-foreground" />
        ) : (
          <ChevronLeft size={12} className="text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}

function NavLink({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={`group flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative ${
        active
          ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <span className={`shrink-0 ${active ? 'text-primary' : ''}`}>{item.icon}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.badge && item.badge > 0 ? (
        <span className="ml-auto bg-accent text-accent-foreground text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {item.badge}
        </span>
      ) : null}
      {collapsed && item.badge && item.badge > 0 ? (
        <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
      ) : null}
    </Link>
  );
}