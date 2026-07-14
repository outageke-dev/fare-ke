'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main
        className={`flex-1 min-w-0 content-transition ${
          collapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}