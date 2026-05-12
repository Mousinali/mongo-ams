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
        {/* Search - Placeholder */}
        <div className="hidden sm:flex items-center relative group">
          <i className="ri-search-line absolute left-3 text-zinc-400 group-focus-within:text-zinc-900 transition-colors"></i>
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-40 md:w-64 bg-zinc-50 border border-zinc-200 rounded-lg pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
          />
        </div>

        
      </div>
    </header>
  );
}
