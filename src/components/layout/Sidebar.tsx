import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, ArrowLeftRight, Settings, DivideIcon as LucideIcon } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-blue-100 text-blue-600'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      {isActive && <div className="w-1 h-6 bg-blue-600 ml-auto rounded-full"></div>}
    </Link>
  );
};

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      to: '/',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      to: '/inventory',
      icon: Package,
      label: 'Envanter',
    },
    {
      to: '/movements',
      icon: ArrowLeftRight,
      label: 'Stok Hareketleri',
    },
    {
      to: '/reports',
      icon: BarChart3,
      label: 'Raporlar',
    },
    {
      to: '/settings',
      icon: Settings,
      label: 'Ayarlar',
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 z-20 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="h-16 flex items-center justify-center border-b">
          <Package className="h-8 w-8 text-blue-600" />
          <h2 className="text-xl font-bold ml-2 text-gray-800">InBeta</h2>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={currentPath === item.to}
            />
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              AY
            </div>
            <div>
              <p className="font-medium text-gray-800">Ahmet Yılmaz</p>
              <p className="text-sm text-gray-500">Yönetici</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;