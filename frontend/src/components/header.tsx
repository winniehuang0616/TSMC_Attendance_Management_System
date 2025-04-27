import React from 'react';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  userName = 'Praful',
  userAvatar = '/avatar.png'
}) => {
  return (
    <header className="fixed left-0 right-0 z-10 h-[11%] bg-white shadow-header">
      <div className="flex justify-between items-center h-full px-8">
        <h1 className="text-blue-900 text-xl font-bold">TSMC Attendance System</h1>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center">
            <Avatar className="h-10 w-10 border border-gray-200">
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