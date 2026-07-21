'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Route, Settings2 } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const bottomNavItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Routes', href: '/fare-tracker', icon: Route },
  { label: 'Reports', href: '/reported-fares', icon: Settings2 },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '#') return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-8">
        {children}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-2xl items-center justify-around px-4 py-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  active
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <Icon size={18} />
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}