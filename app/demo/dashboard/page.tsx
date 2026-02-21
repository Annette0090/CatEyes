'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import { MapPin, Navigation, Clock, Zap } from 'lucide-react';
import CityMap from '@/components/dashboard/Map';
import LandmarkForm from '@/components/dashboard/LandmarkForm';

const DUMMY_LANDMARKS = [
    { name: 'Shell filling station', category: 'FUEL', longitude: -0.1870, latitude: 5.6037, description: 'Popular meeting point near the bypass.' },
    { name: 'Blue Gate Pharmacy', category: 'MEDICAL', longitude: -0.1920, latitude: 5.6100, description: 'Key landmark for local directions.' },
    { name: 'Central Market', category: 'TRADE', longitude: -0.1800, latitude: 5.5950, description: 'High-traffic commercial hub.' },
];

const StatCard = ({ icon, label, value, trend }: any) => (
    <div className="p-6 rounded-2xl glass border-white/5 flex flex-col gap-4">
        <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-accent/5 text-accent border border-accent/20">
                {icon}
            </div>
            <span className="text-xs font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{trend}</span>
        </div>
        <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</div>
            <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
        </div>
    </div>
);

export default function UserDemo() {
    const [isFormOpen, setIsFormOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-slate-950 flex">
            <Sidebar />
            <div className="flex-1 ml-64">
                <TopNav title="User Intelligence Suite" />

                <main className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Operational Overview</h1>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="px-6 py-3 bg-accent text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center gap-2 uppercase text-sm"
                        >
                            <MapPin size={18} />
                            Report Landmark
                        </button>
                    </div>

                    <LandmarkForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard icon={<MapPin size={24} />} label="Active Landmarks" value="2,481" trend="+12%" />
                        <StatCard icon={<Navigation size={24} />} label="Optimized Routes" value="124" trend="+5%" />
                        <StatCard icon={<Clock size={24} />} label="Avg. Savings" value="18m" trend="-4s" />
                        <StatCard icon={<Zap size={24} />} label="System Uptime" value="99.9%" trend="LIVE" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 p-8 rounded-3xl glass border-white/5 relative overflow-hidden group">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-accent animate-ping" />
                                    Sector Visualization [GH-01]
                                </h3>
                                <div className="flex gap-2">
                                    {['2D', '3D', 'LIDAR'].map(view => (
                                        <button key={view} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 hover:text-white transition-all uppercase">{view}</button>
                                    ))}
                                </div>
                            </div>

                            {/* INTERACTIVE MAP */}
                            <div className="aspect-video">
                                <CityMap initialLandmarks={DUMMY_LANDMARKS} />
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl glass border-white/5">
                            <h3 className="text-xl font-bold uppercase tracking-tight mb-8">Recent Alerts</h3>
                            <div className="space-y-4">
                                {[
                                    { type: 'Traffic', time: '2m ago', desc: 'Congestion detected at Shell Station bypass.', color: 'text-orange-400' },
                                    { type: 'System', time: '15m ago', desc: 'New sector nodes synchronized.', color: 'text-accent' },
                                    { type: 'Hazard', time: '1h ago', desc: 'Road construction near High Street.', color: 'text-red-400' },
                                ].map((alert, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all cursor-pointer">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${alert.color}`}>{alert.type}</span>
                                            <span className="text-[10px] text-slate-500 font-mono">{alert.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{alert.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-3 rounded-xl border border-white/5 text-xs text-slate-500 hover:text-white hover:bg-white/5 transition-all uppercase font-bold tracking-widest">
                                View Intelligence Log
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
