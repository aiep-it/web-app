'use client'
import CBreadcrumbs from "@/components/CBreadcrumbs";
import { SideNav } from "@/components/SideNavs";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex">
      <SideNav />
      
      <main className="flex-1 p-6">
        <CBreadcrumbs />
        {children}
      </main>
    </div>
    // <div>
    //   {/* Desktop Sidebar */}
    //   <div className="hidden md:block">
    //     <SideNav isOpen={isOpen} onToggle={toggleSidebar} />
    //   </div>

    //   {/* Mobile Menu */}
    //   <div className="md:hidden">
    //     <Button
    //       isIconOnly
    //       variant="light"
    //       onPress={toggleMobileMenu}
    //       className="fixed top-4 left-4 z-20"
    //     >
    //       <Icon icon="lucide:menu" className="text-xl" />
    //     </Button>
    //     {isMobileMenuOpen && (
    //       <div className="fixed inset-0 bg-background z-10">
    //         <SideNav isOpen={true} onToggle={toggleMobileMenu} />
    //       </div>
    //     )}
    //   </div>
    //   <main
    //     className={`flex-1 p-8 overflow-auto transition-all duration-300 ${isOpen ? "md:ml-64" : "md:ml-20"}`}
    //   >
    //     {children}
    //   </main>
    // </div>
  );
}
