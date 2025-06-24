import React from 'react';
import Link from 'next/link';
import { Icon } from "@iconify/react";
import { ThemeSwitch } from '@/components/theme-switch';
import { Logo } from '@/components/icons';

const menuItems = [
  { group: "Data", items: [
    { name: "Dashboard", icon: "lucide:layout-dashboard", href: "/admin/dashboard" },
    { name: "Users", icon: "lucide:users", href: "/admin/users" },
    { name: "Invoices", icon: "lucide:file-text", href: "/admin/invoices" },
  ]},
  { group: "Content", items: [
    { name: "Manage Category", icon: "lucide:book-plus", href: "/admin/categories" },
    { name: "Manage Roadmap", icon: "lucide:book-plus", href: "/admin/roadmap" },
    { name: "Live Courses", icon: "lucide:video", href: "/admin/live-courses" },
  ]},
  { group: "Customization", items: [
    { name: "////", icon: "lucide:layout", href: "/admin/hero" },
    { name: "////", icon: "lucide:help-circle", href: "/admin/faq" },
    { name: "////", icon: "lucide:tag", href: "/admin/categories" },
  ]},
  { group: "Controllers", items: [
    { name: "////", icon: "lucide:users", href: "/admin/manage-team" },
  ]},
  { group: "Analytics", items: [
    { name: "/////", icon: "lucide:bar-chart", href: "/admin/reports" },
  ]},
];

interface AdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isExpanded, onToggle }) => {
  return (
    <aside className={`bg-gray-900 text-white h-screen flex flex-col border border-gray-700  transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      <div className="p-4 flex items-center justify-between">
        <Logo />
        <button onClick={onToggle} className="p-2 rounded-full hover:bg-gray-800">
          <Icon icon={isExpanded ? "lucide:chevron-left" : "lucide:chevron-right"} width={24} />
        </button>
      </div>
      {/* <div className="p-4 flex items-center space-x-4">
        <img src="" alt="Admin" className="w-10 h-10 rounded-full" />
        {isExpanded && (
          <div>
            <p className="font-medium">shahriar sajeeb</p>
            <p className="text-sm text-gray-400">Admin</p>
          </div>
        )}
      </div> */}
      <nav className="flex-grow overflow-y-auto">
        {menuItems.map((group, index) => (
          <div key={index} className="mb-4">
            {isExpanded && (
              <h2 className="px-4 py-2 text-sm font-semibold text-gray-400">{group.group}</h2>
            )}
            <ul>
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link href={item.href} className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 ${isExpanded ? '' : 'justify-center'}`}>
                    <Icon icon={item.icon} width={24} />
                    {isExpanded && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="p-4 flex justify-center">
       
      </div>
    </aside>
  );
};

export default AdminSidebar;