'use client';

import { ThemeProvider } from 'next-themes';
import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar'; // Giữ nguyên đường dẫn này
import { Icon } from '@iconify/react';
import CBreadcrumbs from '@/components/CBreadcrumbs'; // Từ phiên bản thứ hai
import RoleGate from '@/components/RoleGate';
// import { SideNav } from "@/components/SideNavs"; // Không sử dụng nếu dùng AdminSidebar
// import { Button } from "@heroui/button"; // Không sử dụng nếu không cần Button từ heroui

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true); // Từ phiên bản HEAD
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Có trong cả hai, giữ lại và quản lý nhất quán

  return (
     <RoleGate allowedRoles={['admin']}>
    <ThemeProvider attribute="class"> {/* Từ phiên bản HEAD */}
      <div className="min-h-screen flex bg-gray-100 dark:bg-black">    
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <div
          className={`fixed md:static z-30 md:z-0 transform inset-y-0 left-0 transition duration-200 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
        >
          <AdminSidebar isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
        </div>
        <div className="flex-grow flex flex-col">       
          <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center md:hidden">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
            >
              <Icon icon="lucide:menu" width={24} />
            </button>
          </header>
          <main className="flex-grow p-6 overflow-auto">
            <CBreadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
    </RoleGate>
  );
}