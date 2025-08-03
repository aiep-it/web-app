'use client';

import '@/styles/globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import UserSidebar from '@/components/UserSidebar';
import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutWithSidebar } from './LayoutWithSidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // =======
  // export const metadata: Metadata = {
  //   title: {
  //     default: siteConfig.name,
  //     template: `%s - ${siteConfig.name}`,
  //   },
  //   description: siteConfig.description,
  //   icons: {
  //     icon: "/favicon.ico",
  //   },
  // };

  // export const viewport: Viewport = {
  //   themeColor: [
  //     { media: "(prefers-color-scheme: light)", color: "white" },
  //     { media: "(prefers-color-scheme: dark)", color: "black" },
  //   ],
  // };

  // export default function RootLayout({
  //   children,
  // }: {
  //   children: React.ReactNode;
  // }) {
  // >>>>>>> 9fe4e0c35a50f14a7dfb7c3d5c0cc6c7dca90b55
  return (
 
      <html suppressHydrationWarning lang="en">
        <head />
        <body
          className={clsx(
            'min-h-screen text-foreground bg-background font-sans antialiased',
            fontSans.variable,
          )}
        >
          <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
            {isAdmin ? (
              <div className="relative flex flex-col ">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            ) : (
              // <div className="relative flex bg-white dark:bg-gray-900 min-h-screen">
              //   {/* Mobile Overlay */}
              //   {isMobileMenuOpen && (
              //     <div
              //       className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
              //       onClick={() => setIsMobileMenuOpen(false)}
              //     />
              //   )}

              //   {/* UserSidebar - Always Fixed */}
              //   {isSignedIn && (
              //     <div
              //       className={`fixed z-30 transform inset-y-0 left-0 transition-transform duration-200 ease-in-out ${
              //         isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              //       } md:translate-x-0`}
              //     >
              //       <UserSidebar
              //         isExpanded={isSidebarExpanded}
              //         onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
              //       />
              //     </div>
              //   )}

              //   {/* Main Content */}
              //   <div
              //     className={`flex-grow flex flex-col transition-all duration-300 ${
              //       isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'
              //     }`}
              //   >
              //     {/* Navbar */}
              //     <div className="sticky top-0 z-10">
              //       <Navbar />
              //     </div>

              //     {/* Mobile Menu Button */}
              //     <button
              //       onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              //       className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg md:hidden"
              //     >
              //       <Icon icon="lucide:menu" width={24} />
              //     </button>

              //     {/* Main Content Area */}
              //     <main className="flex-grow bg-white dark:bg-gray-900">
              //       {children}
              //     </main>

              //     <Footer />
              //   </div>
              // </div>
              <LayoutWithSidebar>{children}</LayoutWithSidebar>
            )}
          </Providers>
        </body>
      </html>
  );
}
