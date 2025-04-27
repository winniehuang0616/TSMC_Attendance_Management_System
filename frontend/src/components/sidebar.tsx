import React from "react";
import { Link } from "react-router-dom";

import { FileText, FileSpreadsheet, LogOut } from "lucide-react";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const menuItems: SidebarItem[] = [
    {
      icon: <FileText className="mr-2 h-5 w-5" />,
      label: "請假核准",
      path: "/approval",
    },
    {
      icon: <FileSpreadsheet className="mr-2 h-5 w-5" />,
      label: "資訊總覽",
      path: "/overview",
    },
    {
      icon: <LogOut className="mr-2 h-5 w-5" />,
      label: "登出",
      path: "/logout",
    },
  ];

  return (
    <div className="h-full bg-white pt-20 shadow-sidebar">
      <nav className="flex flex-col">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center px-6 py-4"
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
