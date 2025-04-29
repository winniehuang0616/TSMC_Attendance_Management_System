import React from "react";
import { Link, useLocation } from "react-router-dom";

import { FileText, FileSpreadsheet, LogOut } from "lucide-react";

interface SidebarProps {
  role?: "employee" | "manager";
}

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();

  const commonMenuItems: SidebarItem[] = [
    {
      icon: <FileText className="mr-2 h-5 w-5" />,
      label: "請假申請",
      path: "/apply-form",
    },
    {
      icon: <FileSpreadsheet className="mr-2 h-5 w-5" />,
      label: "請假資訊總覽",
      path: "/personal-overview",
    },
  ];

  const managerExtraItems: SidebarItem[] = [
    {
      icon: <FileText className="mr-2 h-5 w-5" />,
      label: "請假核准",
      path: "/approval",
    },
    {
      icon: <FileSpreadsheet className="mr-2 h-5 w-5" />,
      label: "員工資訊總覽",
      path: "/employee-overview",
    },
  ];

  const logoutItem: SidebarItem = {
    icon: <LogOut className="mr-2 h-5 w-5" />,
    label: "登出",
    path: "/logout",
  };

  const menuItems =
    role === "manager"
      ? [...commonMenuItems, ...managerExtraItems, logoutItem]
      : [...commonMenuItems, logoutItem];

  return (
    <div className="fixed left-0 top-0 z-10 h-full w-[18%] bg-white pt-20 shadow-sidebar">
      <nav className="flex flex-col">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`mx-4 my-1 flex items-center rounded-md px-2 py-2 
                font-semibold text-darkBlue
                ${isActive ? "text-blue-600 bg-background" : "hover:bg-background"}
              `}
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
