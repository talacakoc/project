import React from 'react';
import { Menu, X, Package } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-2 text-gray-600 focus:outline-none lg:hidden"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold ml-2 text-gray-800">
              InBeta Stok Takip
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <div className="relative text-gray-600">
              <input
                type="search"
                placeholder="Ara..."
                className="bg-gray-100 h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-64"
              />
              <button className="absolute right-0 top-0 mt-3 mr-4">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 text-sm hidden md:inline-block">
              Ahmet Yılmaz
            </span>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              AY
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;