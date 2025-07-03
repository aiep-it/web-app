// layout.tsx
'use client';

import "@/styles/globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import { usePathname } from "next/navigation";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
      <html suppressHydrationWarning lang="en">
        <head />
        <body
          className={clsx(
            "min-h-screen text-foreground bg-background   font-sans antialiased",
            fontSans.variable
          )}
        >
          {isAdmin ? (
            children
          ) : (
           
              <div className="relative flex flex-col">
                <Navbar />
                <main className="container mx-auto max-w-7xl pt-0 px-6 flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
         
          )}
        </body>
      </html>
    </Providers>
  );
}
