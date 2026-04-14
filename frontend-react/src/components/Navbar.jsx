import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/#pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-between justify-between gap-20">
          {/* Logo Area */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/assessFlowLogo.png"
                alt="Logo"
                className="h-10 object-contain"
              />
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `text-sm font-[500] transition-colors ${
                    isActive
                      ? "text-blue-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <Link
                  to="/company/login"
                  className="text-sm font-[500] text-slate-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/company/register"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-[500] rounded-lg transition-all shadow-md hover:shadow-xl hover:shadow-blue-500/50 transform hover:scale-105"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="text-sm font-semibold text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-slate-600"></span>
              <span className="block w-6 h-0.5 bg-slate-600"></span>
              <span className="block w-6 h-0.5 bg-slate-600"></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
