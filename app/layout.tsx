'use client';

import '@/styles/globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
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
            <LayoutWithSidebar>{children}</LayoutWithSidebar>
          )}
        </Providers>
      </body>
    </html>
  );
}
