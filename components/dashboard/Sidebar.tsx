import React from 'react';
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
    Eye
} from 'lucide-react';

const Sidebar = ({ isAdmin = false }) => {
    const menuItems = isAdmin ? [
        { icon: <Shield size={20} />, label: 'Command Center', active: true, href: '/admin/dashboard' },
        { icon: <Activity size={20} />, label: 'System Health' },
        { icon: <Map size={20} />, label: 'City Mesh', href: '/dashboard' },
        { icon: <Bell size={20} />, label: 'Incidents' },
        { icon: <Settings size={20} />, label: 'Security Config' },
    ] : [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
        { icon: <Navigation size={20} />, label: 'Landmarks' },
        { icon: <Map size={20} />, label: 'Routes' },
        { icon: <Bell size={20} />, label: 'Alerts' },
        { icon: <Settings size={20} />, label: 'Preferences' },
    ];

    return (
        <aside className="w-64 border-r border-white/5 bg-slate-950/50 backdrop-blur-xl flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isAdmin ? 'bg-red-500' : 'bg-accent'} glow-border`}>
                    <Eye size={18} className="text-black" />
                </div>
                <span className="text-lg font-black tracking-tighter glow-text">CITYEYES</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
                    Intelligence Network
                </div>
                {menuItems.map((item: any, i) => (
                    <a
                        key={i}
                        href={item.href || '#'}
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

            <div className="p-4 border-t border-white/5">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-white/5 mb-4">
                    <div className="text-[10px] text-slate-500 font-mono mb-1">SYSTEM_STATUS</div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-white uppercase tracking-tighter">Connected</span>
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
    );
};

export default Sidebar;
