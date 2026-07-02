import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

export default function SidebarLayout({ links }) {
  const { user } = useAuth();
  const location = useLocation();

  // Determine which link is active
  const isLinkActive = (link) => {
    if (location.pathname === link.href) return true;
    // For index routes like /dashboard, only match exactly or sub-paths that are NOT other sidebar links
    if (link.isIndex) return location.pathname === link.href;
    return location.pathname.startsWith(link.href + "/") || (link.href !== links[0]?.href && location.pathname === link.href);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-60 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-teal-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
              {links.map((link) => {
                const active = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 mb-0.5",
                      active
                        ? "bg-teal-600 text-white shadow-sm shadow-teal-200"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.name}
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
