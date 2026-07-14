'use client';

import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-8">
        {children}
      </div>
    </main>
  );
}