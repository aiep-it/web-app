// web-app/app/layout.tsx
import "@/styles/globals.css";
// import { ClerkProvider } from "@clerk/nextjs"; // <-- BỎ DÒNG NÀY ĐI
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers"; // Vẫn giữ import này

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";


export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <ClerkProvider> // <-- BỎ DÒNG NÀY ĐI
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        {/* <Providers> bây giờ sẽ chứa ClerkProvider bên trong nó */}
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex bg-gray-900 flex-col ">
              <Navbar />
              <main className="container mx-auto bg-gray-900 max-w-7xl pt-16 px-6 flex-grow">
                {children}
              </main>
              <Footer/>
            </div>
        </Providers>
      </body>
    </html>
    // </ClerkProvider> // <-- BỎ DÒNG NÀY ĐI
  );
}