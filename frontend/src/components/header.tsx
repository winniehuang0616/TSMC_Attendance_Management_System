import React from "react";

import { Bell } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
}

const Header: React.FC<HeaderProps> = ({
  userName = "Praful",
  userAvatar = "/avatar.png",
}) => {
  return (
    <header className="fixed left-0 right-0 z-10 h-[11%] bg-white shadow-header">
      <div className="flex h-full items-center justify-between px-8">
        <h1 className="text-blue-900 text-xl font-bold">
          TSMC Attendance System
        </h1>

        <div className="flex items-center space-x-4">
          <button className="hover:bg-gray-100 relative rounded-full p-2">
            <Bell className="text-gray-700 h-6 w-6" />
            <span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-white bg-red-500"></span>
          </button>

          <div className="flex items-center">
            <Avatar className="border-gray-200 h-10 w-10 border">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="ml-2 font-medium">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
