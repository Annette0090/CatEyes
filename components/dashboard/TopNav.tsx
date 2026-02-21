import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

const TopNav = ({ title }: { title: string }) => {
    return (
        <header className="h-20 border-b border-white/5 bg-slate-950/20 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
            <h2 className="text-xl font-bold tracking-tight uppercase text-white">{title}</h2>

            <div className="flex items-center gap-6">
                <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search city mesh..."
                        className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 w-64 transition-all"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
                        <Bell size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-slate-950" />
                    </button>

                    <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-white leading-none mb-1">User_Node_07</div>
                            <div className="text-[10px] text-slate-500 font-mono tracking-tighter">SECURE_AUTH_LAYER</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center p-[1px] shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                            <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center">
                                <User size={20} className="text-accent" />
                            </div>
                        </div>
                        <ChevronDown size={14} className="text-slate-500" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;
