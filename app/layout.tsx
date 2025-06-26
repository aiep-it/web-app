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
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
{/* <<<<<<< HEAD */}
          {isAdmin ? (
            // 👉 Nếu là admin, không bọc container
            children
          ) : (
            <div className="relative flex bg-gray-900 flex-col">
              <Navbar />  
              <main className="container mx-auto bg-gray-900 max-w-7xl pt-16 px-6 flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          )}
{/* // =======
//           <div className="relative flex flex-col ">
//             <Navbar />
//             <main className="flex-1">{children}</main>
//             <Footer />
//           </div>
// >>>>>>> 9fe4e0c35a50f14a7dfb7c3d5c0cc6c7dca90b55 */}
        </Providers>
      </body>
    </html>
  );
}
