"use client";

import { usePathname } from "next/navigation";

interface TopbarProps {
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Topbar({
  onMenuClick,
  isSidebarCollapsed,
  onToggleCollapse,
}: TopbarProps) {
  const pathname = usePathname();

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean)[0] || "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  };

  return (
    <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-4">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-zinc-500 hover:bg-zinc-100 rounded-lg lg:hidden"
        >
          <i className="ri-menu-2-line text-xl"></i>
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
        >
          <i className={`${isSidebarCollapsed ? "ri-sidebar-fold-fill" : "ri-sidebar-fold-line"} text-xl`}></i>
        </button>

        <h1 className="text-lg font-bold text-zinc-900">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Admin Section */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50/50">
          <div className="w-7 h-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
            <i className="ri-user-3-line text-zinc-600 text-sm"></i>
          </div>
          <span className="text-xs font-semibold text-zinc-700 pr-1 hidden sm:block">Admin Account</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all group"
          title="Logout"
        >
          <i className="ri-logout-box-r-line text-xl group-hover:scale-110 transition-transform"></i>
        </button>
      </div>
    </header>
  );
}
