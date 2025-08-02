'use client';

import { useAuth } from '@clerk/nextjs';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import UserSidebar from '@/components/UserSidebar';
import { useState } from 'react';
import { Icon } from '@iconify/react';

export function LayoutWithSidebar({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <div className="relative flex bg-white dark:bg-gray-900 min-h-screen">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      {isSignedIn && (
        <div
          className={`fixed z-30 transform inset-y-0 left-0 transition-transform duration-200 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <UserSidebar
            isExpanded={isSidebarExpanded}
            onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-grow flex flex-col transition-all duration-300 ${
          isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg md:hidden"
        >
          <Icon icon="lucide:menu" width={24} />
        </button>

        <main className="flex-grow bg-white dark:bg-gray-900">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
