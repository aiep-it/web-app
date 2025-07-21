import React from 'react';
import { Link, Tooltip, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";


const navItems = [
  { icon: "lucide:layout-dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "lucide:map", label: "Road Map", href: "/admin/roadmap" },
  { icon: "lucide:hexagon", label: "Node", href: "/admin/topics" },
  { icon: "lucide:bar-chart", label: "Analytics", href: "/analytics" },
  { icon: "lucide:settings", label: "Settings", href: "/settings" },
];


export const SideNav: React.FC = () => {
  return (
    <nav className="flex flex-col h-screen w-16 bg-content1 border-r border-divider">
      <div className="flex-1">
        <div className="p-4">
          <Icon icon="logos:heroui" width="32" height="32" />
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Tooltip content={item.label} placement="right">
                <Link
                  href={item.href}
                  className="flex items-center justify-center w-16 h-16 text-default-500 hover:text-primary hover:bg-primary/10 transition-colors"
                >
                  <Icon icon={item.icon} width="24" height="24" />
                </Link>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>

    </nav>
  );
};