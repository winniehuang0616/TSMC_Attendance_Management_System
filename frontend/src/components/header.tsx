import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  isLoggedIn: boolean;
  userName?: string | null;
  userAvatar?: string;
}

const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  userName,
  userAvatar = "https://github.com/shadcn.png",
}) => {
  return (
    <header className="fixed left-0 right-0 z-20 h-[11%] bg-white shadow-header">
      <div className="flex h-full items-center justify-between px-8">
        <h1 className="text-xl font-bold text-darkBlue">
          TSMC Attendance System
        </h1>

        {isLoggedIn && (
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt={userName || ""} />
              <AvatarFallback>
                {userName ? userName.charAt(0) : "D"}
              </AvatarFallback>
            </Avatar>
            <span className="ml-2 font-medium text-darkBlue">{userName}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
