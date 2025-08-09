import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from "@iconify/react";
import { Logo } from '@/components/icons';
import { siteConfig } from "@/config/site";

interface UserSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isExpanded, onToggle }) => {
  const pathname = usePathname();
  
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white h-screen flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      {/* Header với Logo */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Logo />
          {isExpanded && (
            <span className="font-bold text-inherit">AIEP-IT</span>
          )}
        </div>
        <button onClick={onToggle} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Icon icon={isExpanded ? "lucide:chevron-left" : "lucide:chevron-right"} width={20} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow overflow-y-auto p-4">
        <div className="space-y-3">
          {siteConfig.navItems.map((item) => {
            const isActive = isActiveLink(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center transition-colors text-base font-medium rounded-lg ${
                  isExpanded 
                    ? 'px-4 py-3' 
                    : 'px-3 py-4 justify-center'
                } ${
                  isActive 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-r-4 border-blue-500' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon 
                  icon={getIconForNavItem(item.label)} 
                  width={isExpanded ? 24 : 28} 
                  className={isActive ? 'text-blue-600 dark:text-blue-400' : ''}
                />
                {isExpanded && <span className="ml-4">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

// Helper function để map icon cho từng nav item
function getIconForNavItem(label: string): string {
  const iconMap: Record<string, string> = {
    'Home': 'lucide:home',
    'Learn Vocabulary': 'lucide:book',
    'My Workspace': 'lucide:folder-open',
    'Pricing': 'lucide:credit-card',
    'Chat bot': 'lucide:bot',
    'My Report': 'lucide:clipboard-minus',
    'Profile': 'lucide:user',
    'Dashboard': 'lucide:layout-dashboard',
    'Projects': 'lucide:folder',
    'Team': 'lucide:users',
    'Settings': 'lucide:settings',
    'Help & Feedback': 'lucide:help-circle',
    'Logout': 'lucide:log-out',
    // Add other mappings if needed
  };
  
  return iconMap[label] || 'lucide:circle';
}

export default UserSidebar;
