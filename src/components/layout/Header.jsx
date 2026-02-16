import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header = ({ title, subtitle }) => {
  return (
    <header className="bg-white border-b border-neutral-200 px-8 py-6 sticky top-0 z-40 backdrop-blur-lg bg-white/80">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 w-64 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-neutral-100 rounded-xl transition-colors">
            <Bell className="w-6 h-6 text-neutral-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;