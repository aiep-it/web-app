import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from "@iconify/react";
import { Logo } from '@/components/icons';

const menuItems = [
    {
    group: "Data", items: [
      { name: "Dashboard", icon: "lucide:layout-dashboard", href: "/admin/dashboard" },
      {
        name: "Users", icon: "lucide:users", children: [
          { name: "Student Management", href: "/admin/usermanage" },
          { name: "Staff Management", href: "/admin/usermanage/staffs" },
        ]
      },
      { name: "classmanage", icon: "lucide:school", href: "/admin/classmanage" },
    ]
  },
  { group: "Content", items: [
    { name: "Manage Category", icon: "lucide:chart-bar-stacked", href: "/admin/categories" },
    { name: "Manage Roadmap", icon: "lucide:book-plus", href: "/admin/roadmaps" },
    { name: "Manage Vocabulary", icon: "lucide:whole-word", href: "/admin/vocabularies" },
    { name: "Manage Exercises", icon: "lucide:notebook-text", href: "/admin/exercises" },
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (itemName: string) => {
    setOpenDropdown(prev => (prev === itemName ? null : itemName));
  };

  return (
    <aside className={`bg-black text-white h-screen flex flex-col border border-gray-700 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>

      <div className="p-4 flex items-center justify-between">
        <Logo />
        <button onClick={onToggle} className="p-2 rounded-full hover:bg-gray-800">
          <Icon icon={isExpanded ? "lucide:chevron-left" : "lucide:chevron-right"} width={24} />
        </button>
      </div>

      <nav className="flex-grow overflow-y-auto">
        {menuItems.map((group, index) => (
          <div key={index} className="mb-4">
            {isExpanded && (
              <h2 className="px-4 py-2 text-sm font-semibold text-gray-400">{group.group}</h2>
            )}
            <ul>
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {!item.children ? (
                    <Link href={item.href} className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 ${isExpanded ? '' : 'justify-center'}`}>
                      <Icon icon={item.icon} width={24} />
                      {isExpanded && <span className="ml-3">{item.name}</span>}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-800 ${isExpanded ? 'justify-start' : 'justify-center'}`}
                      >
                        <Icon icon={item.icon} width={24} />
                        {isExpanded && (
                          <>
                            <span className="ml-3 flex-1 text-left">{item.name}</span>
                            <Icon icon={openDropdown === item.name ? "lucide:chevron-up" : "lucide:chevron-down"} width={18} />
                          </>
                        )}
                      </button>
                      {openDropdown === item.name && isExpanded && (
                        <ul className="ml-10 text-sm">
                          {item.children.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link href={subItem.href} className="block px-2 py-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;