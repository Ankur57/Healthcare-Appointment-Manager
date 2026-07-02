import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { cn } from "../../utils/cn";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "patient") return "/dashboard";
    if (user.role === "doctor") return "/doctor/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/";
  };

  const roleColors = {
    patient: "bg-blue-100 text-blue-700",
    doctor: "bg-emerald-100 text-emerald-700",
    admin: "bg-purple-100 text-purple-700",
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-sm shadow-sm">
            M
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Medi<span className="text-teal-600">Flow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-colors"
              >
                Dashboard
              </Link>
              <div className="w-px h-5 bg-gray-200 mx-2" />
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-semibold flex items-center justify-center text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 leading-none">{user.name}</p>
                    <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded-full capitalize mt-0.5 inline-block", roleColors[user.role] || "bg-gray-100 text-gray-700")}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600">
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                Sign in
              </Link>
              <Button size="sm" onClick={() => navigate("/register")} className="ml-1">
                Get Started
              </Button>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-2">
          {user ? (
            <>
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-teal-600 text-white font-semibold flex items-center justify-center">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">Sign in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm font-medium text-teal-600 rounded-lg hover:bg-teal-50">Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
