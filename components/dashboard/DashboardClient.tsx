'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopNav from '@/components/dashboard/TopNav';
import CityMap from '@/components/dashboard/Map';
import LandmarkForm from '@/components/dashboard/LandmarkForm';
import IncidentForm from '@/components/dashboard/IncidentForm';
import { MapPin, Navigation, Clock, Zap, AlertTriangle } from 'lucide-react';

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

export default function DashboardClient({ userEmail, fullName, initialLandmarks = [], initialIncidents = [], userSubmissions = [] }: { userEmail: string, fullName: string, initialLandmarks?: any[], initialIncidents?: any[], userSubmissions?: any[] }) {
    const [isLandmarkFormOpen, setIsLandmarkFormOpen] = useState(false);
    const [isIncidentFormOpen, setIsIncidentFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLandmarks = initialLandmarks.filter(l =>
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 flex">
            <Sidebar />
            <div className="flex-1 ml-64">
                <TopNav title="Operational Console" onSearch={setSearchQuery} />

                <main className="p-8">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Welcome Back, {fullName}</h1>
                            <p className="text-slate-400 text-sm">System integrity optimal. Deployment status: ACTIVE.</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsLandmarkFormOpen(true)}
                                className="px-6 py-3 bg-accent text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center gap-2 uppercase text-xs"
                            >
                                <MapPin size={16} />
                                Report Landmark
                            </button>
                            <button
                                onClick={() => setIsIncidentFormOpen(true)}
                                className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 uppercase text-xs"
                            >
                                <AlertTriangle size={16} />
                                Report Incident
                            </button>
                        </div>
                    </div>

                    <LandmarkForm isOpen={isLandmarkFormOpen} onClose={() => setIsLandmarkFormOpen(false)} />
                    <IncidentForm isOpen={isIncidentFormOpen} onClose={() => setIsIncidentFormOpen(false)} />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard icon={<MapPin size={24} />} label="Active Landmarks" value="2,481" trend="+12%" />
                        <StatCard icon={<Navigation size={24} />} label="Optimized Routes" value="124" trend="+5%" />
                        <StatCard icon={<Clock size={24} />} label="Avg. Savings" value="18m" trend="-4s" />
                        <StatCard icon={<Zap size={24} />} label="System Uptime" value="99.9%" trend="LIVE" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="p-8 rounded-3xl glass border-white/5 relative overflow-hidden group">
                                <div className="aspect-video">
                                    <CityMap initialLandmarks={filteredLandmarks} initialIncidents={initialIncidents} />
                                </div>
                            </div>

                            <div className="p-8 rounded-3xl glass border-white/5">
                                <h3 className="text-xl font-bold uppercase tracking-tight mb-6 flex justify-between items-center">
                                    My Intelligence History
                                    <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">ID_{userEmail.split('@')[0].toUpperCase()}</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {userSubmissions.length === 0 ? (
                                        <div className="col-span-2 py-12 text-center border border-dashed border-white/10 rounded-2xl">
                                            <p className="text-slate-500 text-sm">No personal nodes established in this sector yet.</p>
                                        </div>
                                    ) : (
                                        userSubmissions.map((sub: any, i: number) => (
                                            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/20 transition-all flex justify-between items-start gap-4">
                                                <div className="flex gap-4">
                                                    <div className={`p-3 rounded-xl ${sub.is_verified ? 'bg-accent/10 text-accent' : 'bg-yellow-500/10 text-yellow-500'} border border-current/20`}>
                                                        <MapPin size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white mb-1">{sub.name}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{sub.category}</p>
                                                    </div>
                                                </div>
                                                <div className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${sub.is_verified ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                                    {sub.is_verified ? 'Verified' : 'Pending'}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl glass border-white/5">
                            <h3 className="text-xl font-bold uppercase tracking-tight mb-8">User Intelligence</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-[10px] text-slate-500 font-mono mb-1">AUTH_NODE</div>
                                    <div className="text-sm font-bold text-white uppercase">{userEmail}</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="text-[10px] text-slate-500 font-mono mb-1">SECTOR_STATUS</div>
                                    <div className="text-sm font-bold text-green-500 uppercase tracking-tighter">Synchronized</div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-2">Live Intelligence Feed</div>
                                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {initialIncidents.length === 0 ? (
                                        <div className="text-[10px] text-slate-600 italic px-2">No active incidents in your sector.</div>
                                    ) : (
                                        initialIncidents.map((incident: any, i: number) => (
                                            <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-red-500/20 transition-all group">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">{incident.type}</span>
                                                    <span className="text-[8px] text-slate-600 font-mono">{new Date(incident.created_at).toLocaleTimeString()}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{incident.description}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
