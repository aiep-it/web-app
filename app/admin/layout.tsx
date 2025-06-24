//admin/layout.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { Icon } from '@iconify/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider attribute="class">
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
        {/* Overlay mobile */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed md:static z-30 md:z-0 transform inset-y-0 left-0 transition duration-200 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <AdminSidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
        </div>

        {/* Content */}
        <div className="flex-grow flex flex-col">
          {/* Mobile Header */}
          <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center md:hidden">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
            >
              <Icon icon="lucide:menu" width={24} />
            </button>
          </header>

          <main className="flex-grow p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
