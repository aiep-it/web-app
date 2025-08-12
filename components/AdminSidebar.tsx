import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Logo } from '@/components/icons';
import { USER_ROLE } from '@/constant/authorProtect';
import { useAuth } from '@clerk/clerk-react';

const menuItems = [
  {
    group: 'Data',
    items: [
      {
        name: 'Dashboard',
        icon: 'lucide:layout-dashboard',
        href: '/admin/dashboard',
        roleAccess: [USER_ROLE.ADMIN],
      },
      {
        name: 'Users',
        icon: 'lucide:users',
        roleAccess: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
        children: [
          { name: 'Student Management', href: '/admin/usermanage', roleAccess: [USER_ROLE.ADMIN, USER_ROLE.STAFF] },
          { name: 'Staff Management', href: '/admin/usermanage/staffs',  roleAccess: [USER_ROLE.ADMIN] },
        ],
      },
      {
        name: 'classmanage',
        icon: 'lucide:school',
        href: '/admin/classmanage',
        roleAccess: [USER_ROLE.STAFF],
      },
    ],
  },
  {
    group: 'Content',
    items: [
      {
        name: 'Manage Level',
        icon: 'lucide:chart-bar-stacked',
        href: '/admin/categories',
        roleAccess: [USER_ROLE.ADMIN]
      },
      {
        name: 'Manage Roadmap',
        icon: 'lucide:book-plus',
        href: '/admin/roadmaps',
        roleAccess: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
      },
      // {
      //   name: 'Manage Vocabulary',
      //   icon: 'lucide:whole-word',
      //   href: '/admin/vocabularies',
      // },
      {
        name: 'Manage Exercises',
        icon: 'lucide:notebook-text',
        href: '/admin/exercises',
        roleAccess: [USER_ROLE.ADMIN, USER_ROLE.STAFF],
      },
  
    ],
  },
];

interface AdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isExpanded,
  onToggle,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { sessionClaims } = useAuth();
  const [currentRole, setCurrentRole] = useState<USER_ROLE | null>(null);

  const toggleDropdown = (itemName: string) => {
    setOpenDropdown((prev) => (prev === itemName ? null : itemName));
  };

  const isActiveLink = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    interface Metadata {
      role?: string;
    }

    const metadata = sessionClaims?.metadata as Metadata;

    if (metadata?.role) {
      const role = metadata.role.toUpperCase() as USER_ROLE;

      setCurrentRole(role);
    }
  }, [sessionClaims]);

  return (
    <aside
      className={`sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white h-screen flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      {/* Header and Logo */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Logo />
          {isExpanded && <span className="font-bold text-inherit">ADMIN</span>}
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Icon
            icon={isExpanded ? 'lucide:chevron-left' : 'lucide:chevron-right'}
            width={20}
          />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow overflow-y-auto p-4">
        {menuItems.map((group, index) => (
          <div key={index} className="mb-6">
            {isExpanded && (
              <h2 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {group.group}
              </h2>
            )}
            <div className="space-y-2">
              {currentRole && group.items.filter((menu)=>menu.roleAccess.includes(currentRole)).map((item, itemIndex) => (
                <div key={itemIndex}>
                  {!item.children && (item.roleAccess.includes(currentRole)) ? (
                    <Link
                      href={item.href}
                      className={`flex items-center transition-colors text-base font-medium rounded-lg ${
                        isExpanded ? 'px-4 py-3' : 'px-3 py-4 justify-center'
                      } ${
                        isActiveLink(item.href)
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-r-4 border-blue-500'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon
                        icon={item.icon}
                        width={isExpanded ? 24 : 28}
                        className={
                          isActiveLink(item.href)
                            ? 'text-blue-600 dark:text-blue-400'
                            : ''
                        }
                      />
                      {isExpanded && <span className="ml-4">{item.name}</span>}
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`flex items-center w-full transition-colors text-base font-medium rounded-lg ${
                          isExpanded ? 'px-4 py-3' : 'px-3 py-4 justify-center'
                        } text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`}
                      >
                        <Icon icon={item.icon} width={isExpanded ? 24 : 28} />
                        {isExpanded && (
                          <>
                            <span className="ml-4 flex-1 text-left">
                              {item.name}
                            </span>
                            <Icon
                              icon={
                                openDropdown === item.name
                                  ? 'lucide:chevron-up'
                                  : 'lucide:chevron-down'
                              }
                              width={18}
                            />
                          </>
                        )}
                      </button>
                      {openDropdown === item.name && isExpanded && (
                        <div className="ml-8 mt-2 space-y-1">
                          {item.children && item.children.filter((menu) => menu.roleAccess.includes(currentRole) ).map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                                isActiveLink(subItem.href)
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
