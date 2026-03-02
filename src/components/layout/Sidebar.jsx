import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  LogOut,
  Sparkles,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Projets",
      icon: FolderKanban,
      path: "/projets",
    },
    ...(user?.role !== "SOMFY"
      ? [
          {
            title: "Utilisateurs",
            icon: Users,
            path: "/users",
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-neutral-200 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900">CRM Pro</h1>
          </div>
        </div>
        
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-neutral-700" />
          ) : (
            <Menu className="w-6 h-6 text-neutral-700" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 top-16"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] lg:h-screen
          w-72 bg-white border-r border-neutral-200 flex flex-col
          z-50 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo - Desktop Only */}
        <div className="hidden lg:block p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">CRM Pro</h1>
              <p className="text-xs text-neutral-500">Gestion de projets</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 lg:p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center text-white font-bold text-base lg:text-lg shadow-lg">
              {user?.nom?.charAt(0) || user?.first_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm lg:text-base text-neutral-900 truncate">
                {user?.first_name || "Utilisateur"}
              </p>
              <p className="text-xs lg:text-sm text-neutral-500 truncate">
                {user?.email || "email@exemple.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl font-medium transition-all duration-200 group ${
                      isActive
                        ? "bg-primary-50 text-primary-700 shadow-sm"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary-600" : "text-neutral-400 group-hover:text-neutral-600"}`}
                      />
                      <span className="flex-1 text-sm lg:text-base">{item.title}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 lg:p-4 border-t border-neutral-200">
          <button
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
            className="w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl font-medium text-sm lg:text-base text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;