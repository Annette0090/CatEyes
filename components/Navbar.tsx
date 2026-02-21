import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-accent glow-border" />
        <span className="text-xl font-bold tracking-tighter glow-text">CITYEYES</span>
      </div>

      <div className="hidden lg:flex gap-8 text-sm font-medium text-slate-400 items-center">
        <a href="#features" className="hover:text-accent transition-colors">Features</a>
        <a href="/demo/dashboard" className="hover:text-accent transition-colors">User Demo</a>
        <a href="/demo/admin" className="hover:text-red-500 transition-colors">Admin Demo</a>
        <a href="/login" className="hover:text-accent transition-colors">Sign In</a>
      </div>

      <a href="/signup" className="px-5 py-2 rounded-full bg-accent text-black text-sm font-bold hover:scale-105 transition-transform">
        Get Demo
      </a>
    </nav>
  );
};

export default Navbar;
