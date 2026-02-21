'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import { Target, ShieldAlert, Cpu, Check, X, Clock, MapPin } from 'lucide-react';
import { verifyLandmark, deleteLandmark } from '@/app/admin/dashboard/actions';

const AdminStat = ({ label, value, sub, color = 'accent' }: any) => (
    <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${color === 'accent' ? 'accent' : 'red-500'} opacity-[0.03] blur-3xl`} />
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-4xl font-black text-white tracking-tighter mb-2">{value}</div>
        <div className={`text-xs flex items-center gap-1 ${color === 'accent' ? 'text-accent' : 'text-red-500'}`}>
            <span>{sub} system_cycle_rate</span>
        </div>
    </div>
);

export default function AdminDashboardClient({ pendingLandmarks }: { pendingLandmarks: any[] }) {
    const [items, setItems] = React.useState(pendingLandmarks);

    const handleAction = async (id: string, action: 'verify' | 'delete') => {
        const result = action === 'verify' ? await verifyLandmark(id) : await deleteLandmark(id);
        if (!result.error) {
            setItems(items.filter(item => item.id !== id));
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex">
            <Sidebar isAdmin={true} />
            <div className="flex-1 ml-64">
                <TopNav title="Strategic Command Center" />

                <main className="p-8">
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
                                <div className="text-[10px] text-slate-500 font-mono uppercase">Verification_Queue</div>
                                <div className="text-sm font-bold text-white">{items.length} Pending</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <AdminStat label="Network Capacity" value="1.2 PB/s" sub="OPTIMAL" />
                        <AdminStat label="Identity Checks" value="482.1k" sub="+8% " />
                        <AdminStat label="Grid Stability" value="99.98%" sub="SECURE" />
                        <AdminStat label="Pending Sync" value={items.length} sub="REQUIRES_ACTION" color="red" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 p-8 rounded-3xl glass border-white/5">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold uppercase flex items-center gap-3 text-white">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    Landmark Verification Queue
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {items.length === 0 ? (
                                    <div className="text-center py-20 border border-dashed border-white/5 rounded-2xl">
                                        <div className="text-slate-500 text-sm font-mono italic">No pending synchronizations in queue. Grid is stable.</div>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <div key={item.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                                            <div className="flex gap-4 items-start">
                                                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                                                    <MapPin size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-bold text-white uppercase">{item.name}</span>
                                                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-400 font-mono">{item.category}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 max-w-md line-clamp-1">{item.description || 'No system descriptor provided.'}</p>
                                                    <div className="flex gap-4 mt-2">
                                                        <span className="text-[10px] font-mono text-slate-600 flex items-center gap-1"><Clock size={10} /> {new Date(item.created_at).toLocaleDateString()}</span>
                                                        <span className="text-[10px] font-mono text-slate-600 flex items-center gap-1"><Target size={10} /> {item.latitude}, {item.longitude}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button
                                                    onClick={() => handleAction(item.id, 'verify')}
                                                    className="flex-1 md:w-10 h-10 md:h-10 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-black transition-all"
                                                    title="Authorize Synchronization"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(item.id, 'delete')}
                                                    className="flex-1 md:w-10 h-10 md:h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                                    title="Decline Synchronization"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl glass border-white/5 flex flex-col bg-slate-900/50">
                            <h3 className="text-xl font-bold uppercase mb-8 flex items-center gap-3 text-white">
                                <Cpu size={20} className="text-red-500" />
                                Administrative Log
                            </h3>
                            <div className="flex-1 space-y-6">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-widest">Active_Node</div>
                                    <div className="text-xs font-bold text-white uppercase italic">Root_Admin_Alpha</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-widest">System_Heartbeat</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-bold text-green-500 uppercase tracking-tighter">Normal</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 p-4 border border-red-500/10 rounded-xl bg-red-500/5">
                                <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Protocol Warning</div>
                                <p className="text-[10px] text-slate-400 italic">Landmark verification is irreversible within the current node cycle. Exercise discretion.</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
