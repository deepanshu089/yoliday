import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, Bell, Home, Briefcase, FileInput, UserCircle, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Portfolio', to: '/portfolio/projects' },
    { label: 'Inputs', to: '/inputs' },
    { label: 'Profile', to: '/profile' },
  ];

   const handleProfileClick = () => {
    console.log('User profile clicked');
    // TODO: Implement user menu or redirect
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-[#E85C41] text-white transition-all duration-300 z-20",
          isSidebarOpen ? "w-64" : "w-20",
          "hidden md:block" // Hide sidebar on mobile
        )}
      >
        <div className="p-4 flex items-center space-x-2">
           <div className={cn("flex-shrink-0", !isSidebarOpen && "px-1")}>
              {isSidebarOpen && (
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                   {/* Placeholder for Logo icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#E85C41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 17V22" stroke="#E85C41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 7L12 12L22 7" stroke="#E85C41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 2V7" stroke="#E85C41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 9L12 12L17 9" stroke="#E85C41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
               </div>
              )}
           </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn("p-2 hover:bg-white/10 rounded-lg rtl:rotate-180", !isSidebarOpen && "mx-auto")}
          >
            <Menu size={24} />
          </button>
           <span className={cn("text-xl font-semibold transition-opacity duration-300", !isSidebarOpen && "opacity-0 hidden")}>LOGO</span>
        </div>

        <nav className="mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-4 py-3 text-white hover:bg-white/10",
                  isActive && "bg-white/10"
                )
              }
            >
              <span className={cn("mr-3 transition-opacity", isSidebarOpen ? "opacity-100" : "opacity-0")}>{item.icon || <Home size={20} />}</span>
              <span className={cn("transition-opacity", isSidebarOpen ? "opacity-100" : "opacity-0")}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className={cn("flex-1 transition-all duration-300 md:ml-20", isSidebarOpen ? "md:ml-64" : "md:ml-20")}>
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center px-4 md:px-6 justify-between">
           {/* Placeholder for Logo on Mobile */}
           <div className="md:hidden flex items-center justify-center w-10 h-10 bg-white rounded-full">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="#E85C41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 17V22" stroke="#E85C41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 7L12 12L22 7" stroke="#E85C41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2V7" stroke="#E85C41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 9L12 12L17 9" stroke="#E85C41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
           </div>

          {/* Right side: Notification and User */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleProfileClick}>
              <img
                src="https://via.placeholder.com/40"
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="text-sm">
                <div className="font-semibold">Lorem Ips</div>
                <div className="text-gray-500">Manager</div>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-10">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center py-2 px-4 text-gray-600",
                    isActive && "text-[#E85C41]"
                  )
                }
              >
                {item.icon || <Home size={20} />}
                <span className="text-xs mt-1">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Layout;