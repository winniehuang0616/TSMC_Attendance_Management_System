import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, FileSpreadsheet, LogOut } from 'lucide-react';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const menuItems: SidebarItem[] = [
    {
      icon: <FileText className="w-5 h-5 mr-2" />,
      label: '請假核准',
      path: '/approval'
    },
    {
      icon: <FileSpreadsheet className="w-5 h-5 mr-2" />,
      label: '資訊總覽',
      path: '/overview'
    },
    {
      icon: <LogOut className="w-5 h-5 mr-2" />,
      label: '登出',
      path: '/logout'
    }
  ];

  return (
    <div className="h-full pt-20 bg-white shadow-sidebar">
      <nav className="flex flex-col">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="flex items-center py-4 px-6 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;