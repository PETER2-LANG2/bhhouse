import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, BedDouble, Users, Banknote, LogOut, MessageSquare, ClipboardList, User as UserIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const adminLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/rooms', label: 'Rooms', icon: BedDouble },
    { to: '/boarders', label: 'Boarders', icon: Users },
    { to: '/payments', label: 'Payments', icon: Banknote },
    { to: '/reports', label: 'Reports', icon: ClipboardList },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
  ];

  const tenantLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/payments', label: 'Payments', icon: Banknote },
    { to: '/reports', label: 'Reports', icon: ClipboardList },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: UserIcon },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : tenantLinks;

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-slate-800">
        <h1 className="text-xl font-bold">Madaje BH</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center">
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-white truncate w-40">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-4 flex w-full items-center justify-center rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
