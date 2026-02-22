'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import { Target, ShieldAlert, Cpu, BarChart4, ArrowUpRight, Activity } from 'lucide-react';

const AdminStat = ({ label, value, sub, color = 'accent' }: any) => (
    <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${color === 'accent' ? 'accent' : 'red-500'} opacity-[0.03] blur-3xl`} />
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-4xl font-black text-white tracking-tighter mb-2">{value}</div>
        <div className={`text-xs flex items-center gap-1 ${color === 'accent' ? 'text-accent' : 'text-red-500'}`}>
            <ArrowUpRight size={14} />
            <span>{sub} vs last cycle</span>
        </div>
    </div>
);

export default function AdminDemo() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 flex overflow-x-hidden">
            <Sidebar isAdmin={true} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 lg:ml-64 transition-all duration-300">
                <TopNav title="Strategic Command Center" onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="p-8">
                    {/* HIGH PRIORITY STATUS */}
                    <div className="mb-10 flex flex-wrap gap-4 items-center justify-between p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 border border-red-500/30">
                                <ShieldAlert size={28} />
                            </div>
                            <div>
                                <div className="text-xs font-black text-red-500 uppercase tracking-widest">Global Watch</div>
                                <div className="text-lg font-bold text-white uppercase tracking-tight">Active Surveillance: Level 4 Delta</div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <div className="text-[10px] text-slate-500 font-mono uppercase">Mesh_Saturation</div>
                                <div className="text-sm font-bold text-white">92.4%</div>
                            </div>
                            <div className="text-right pl-4 border-l border-white/10">
                                <div className="text-[10px] text-slate-500 font-mono uppercase">Node_Ping</div>
                                <div className="text-sm font-bold text-green-500">OPTIMAL</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <AdminStat label="Network Capacity" value="1.2 PB/s" sub="+4.2%" />
                        <AdminStat label="Identity Checks" value="482.1k" sub="+8% " />
                        <AdminStat label="Grid Stability" value="99.98%" sub="+0.02%" />
                        <AdminStat label="Incident Response" value="1.2s" sub="-0.4s" color="red" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 p-8 rounded-3xl glass border-white/5">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold uppercase flex items-center gap-3">
                                    <Cpu className="text-red-500" />
                                    Neural Processing Load
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-[10px] text-slate-500 font-mono uppercase">Real-time Stream</span>
                                </div>
                            </div>

                            <div className="h-80 flex items-end justify-between gap-2 px-4">
                                {[45, 60, 55, 80, 75, 90, 85, 40, 65, 78, 92, 70, 60, 85, 95].map((h, i) => (
                                    <div key={i} className="flex-1 group relative">
                                        <div
                                            className={`w-full rounded-t-lg transition-all duration-500 border-t ${i % 3 === 0 ? 'bg-red-500/20 border-red-500/50' : 'bg-slate-800/40 border-white/10'}`}
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 px-2 py-1 rounded text-[8px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                VAL: {h}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl glass border-white/5 flex flex-col">
                            <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-2">
                                <Target className="text-red-500" />
                                Active Operations
                            </h3>
                            <div className="flex-1 space-y-6">
                                {[
                                    { name: 'Operation Neon', progress: 85, status: 'SYNCING' },
                                    { name: 'Grid Cleanup IV', progress: 42, status: 'FILTERING' },
                                    { name: 'LIDAR Sweep 09', progress: 100, status: 'COMPLETE' },
                                ].map((op, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-sm font-bold text-white uppercase">{op.name}</span>
                                            <span className="text-[10px] font-mono text-slate-500">{op.status}</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${op.progress === 100 ? 'bg-green-500' : 'bg-red-500'}`}
                                                style={{ width: `${op.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-bold uppercase text-xs hover:bg-red-500 hover:text-white transition-all tracking-widest">
                                Authorize Countermeasure
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
