'use client';

import { ThemeProvider } from 'next-themes';
import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar'; // Giữ nguyên đường dẫn này
import { Icon } from '@iconify/react';
import CBreadcrumbs from '@/components/CBreadcrumbs'; // Từ phiên bản thứ hai
import { Navbar } from "@/components/navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true); // Từ phiên bản HEAD
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Có trong cả hai, giữ lại và quản lý nhất quán

  return (
    <ThemeProvider attribute="class"> {/* Từ phiên bản HEAD */}
      <div className="min-h-screen flex bg-gray-200 dark:bg-black ">
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
          {/* Sử dụng AdminSidebar và truyền props isExpanded, onToggle */}
          <AdminSidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
        </div>

        {/* Content */}
        <div className="flex-grow flex flex-col">
         
 
           <Navbar />
          <main className="flex-grow p-6 overflow-auto">
            <CBreadcrumbs /> {/* Từ phiên bản thứ hai */}
             
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}