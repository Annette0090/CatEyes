'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Map,
    Settings,
    Shield,
    Activity,
    Bell,
    User,
    LogOut,
    Navigation,
    Eye,
    X,
    Zap
} from 'lucide-react';

const Sidebar = ({
    isAdmin = false,
    isSuperAdmin = false,
    isOpen = false,
    onClose = () => { },
    onLandmarksClick,
    onAlertsClick,
    onPreferencesClick,
    trustScore = 1,
    intelCredits = 0
}: {
    isAdmin?: boolean,
    isSuperAdmin?: boolean,
    isOpen?: boolean,
    onClose?: () => void,
    onLandmarksClick?: () => void,
    onAlertsClick?: () => void,
    onPreferencesClick?: () => void,
    trustScore?: number,
    intelCredits?: number
}) => {
    const pathname = usePathname();
    const trustLevel = Math.floor(trustScore / 100) + 1;
    const trustProgress = trustScore % 100;

    const menuItems = isAdmin ? [
        { icon: <Shield size={20} />, label: 'Command Center', href: '/admin/dashboard', active: pathname === '/admin/dashboard' },
        { icon: <Activity size={20} />, label: 'System Health', active: false },
        { icon: <Map size={20} />, label: 'City Mesh', href: '/dashboard', active: pathname === '/dashboard' },
        { icon: <Bell size={20} />, label: 'Incidents', active: false },
        { icon: <Settings size={20} />, label: 'Security Config', onClick: onPreferencesClick, active: false },
    ] : [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard', active: pathname === '/dashboard' },
        { icon: <Navigation size={20} />, label: 'Landmarks', onClick: onLandmarksClick, active: false },
        { icon: <Map size={20} />, label: 'Routes', active: false },
        { icon: <Bell size={20} />, label: 'Alerts', onClick: onAlertsClick, active: false },
        { icon: <Settings size={20} />, label: 'Preferences', onClick: onPreferencesClick, active: false },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <aside className={`w-64 border-r border-white/5 bg-slate-950/80 backdrop-blur-2xl flex flex-col h-screen fixed left-0 top-0 z-[101] transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isAdmin ? 'bg-red-500' : 'bg-accent'} glow-border`}>
                            <Eye size={18} className="text-black" />
                        </div>
                        <span className="text-lg font-black tracking-tighter glow-text">CITYEYES</span>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
                        Intelligence Network
                    </div>
                    {menuItems.map((item: any, i) => (
                        <a
                            key={i}
                            href={item.href || '#'}
                            onClick={(e) => {
                                if (item.onClick) {
                                    e.preventDefault();
                                    item.onClick();
                                    onClose();
                                }
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${item.active
                                ? (isAdmin ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent')
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-4">
                    {/* Citizen XP Section */}
                    <div className="px-2">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <div className="text-[10px] text-slate-500 font-mono uppercase">Trust_Level</div>
                                <div className="text-sm font-black text-accent uppercase italic">Tier {trustLevel} Agent</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-slate-500 font-mono uppercase">Credits</div>
                                <div className="text-xs font-bold text-white flex items-center gap-1 justify-end">
                                    <Zap size={10} className="text-yellow-500 fill-yellow-500" />
                                    {intelCredits}
                                </div>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent rounded-full transition-all duration-1000"
                                style={{ width: `${trustProgress}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-white/5">
                        <div className="text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-widest">{isSuperAdmin ? 'Root_Access' : 'System_Status'}</div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-bold text-white uppercase tracking-tighter">{isSuperAdmin ? 'Super Admin' : 'Connected'}</span>
                        </div>
                    </div>
                    <form action="/auth/signout" method="post">
                        <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-500 hover:text-red-400 transition-colors">
                            <LogOut size={16} />
                            <span>Disconnect</span>
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
