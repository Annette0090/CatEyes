'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { X, Bell, MapPin, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'landmark' | 'incident';
    title: string;
    description: string;
    created_at: string;
    severity?: string;
    status?: string;
}

export default function ActivityFeed({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchActivities = async () => {
        setLoading(true);
        try {
            // Fetch recent landmarks
            const { data: landmarks } = await supabase
                .from('landmarks')
                .select('id, name, description, created_at')
                .order('created_at', { ascending: false })
                .limit(10);

            // Fetch recent incidents
            const { data: incidents } = await supabase
                .from('incidents')
                .select('id, type, description, created_at, severity, status')
                .order('created_at', { ascending: false })
                .limit(10);

            const combined: ActivityItem[] = [
                ...(landmarks || []).map(l => ({
                    id: l.id,
                    type: 'landmark' as const,
                    title: l.name,
                    description: l.description || 'New landmark discovered.',
                    created_at: l.created_at
                })),
                ...(incidents || []).map(i => ({
                    id: i.id,
                    type: 'incident' as const,
                    title: `Incident: ${i.type}`,
                    description: i.description || 'Hazard reported in sector.',
                    created_at: i.created_at,
                    severity: i.severity,
                    status: i.status
                }))
            ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setActivities(combined.slice(0, 15));
        } catch (error) {
            console.error('Error fetching activity:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchActivities();

            // Realtime subscriptions
            const landmarksSub = supabase
                .channel('landmarks-feed')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'landmarks' }, () => fetchActivities())
                .subscribe();

            const incidentsSub = supabase
                .channel('incidents-feed')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incidents' }, () => fetchActivities())
                .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'incidents' }, () => fetchActivities())
                .subscribe();

            return () => {
                landmarksSub.unsubscribe();
                incidentsSub.unsubscribe();
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-end p-0 md:p-4 pointer-events-none">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

            <div className="w-full h-full md:h-auto md:max-h-[90vh] md:w-[400px] bg-slate-950 border-l md:border border-white/10 md:rounded-3xl pointer-events-auto flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-300">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                            <Bell size={18} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-white leading-none">Live Dispatch Feed</h2>
                            <span className="text-[10px] font-mono text-red-500 uppercase">Operational_Realtime_Grid</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="w-8 h-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Synchronizing_Grid...</span>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-white/5 rounded-2xl">
                            <p className="text-slate-500 text-xs italic">Grid is currently silent. No active dispatches.</p>
                        </div>
                    ) : (
                        activities.map((item) => (
                            <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/20 transition-all group relative overflow-hidden">
                                {item.type === 'incident' && item.severity === 'HIGH' && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                                )}
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'landmark' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                        }`}>
                                        {item.type === 'landmark' ? <MapPin size={18} /> : <AlertTriangle size={18} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xs font-bold text-white uppercase truncate">{item.title}</h3>
                                            <span className="text-[8px] font-mono text-slate-600 flex items-center gap-1">
                                                <Clock size={8} /> {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-normal line-clamp-2 mb-2">{item.description}</p>
                                        <div className="flex items-center gap-2">
                                            {item.type === 'incident' && (
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${item.status === 'RESOLVED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {item.status || 'ACTIVE'}
                                                </span>
                                            )}
                                            {item.type === 'landmark' && (
                                                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-accent/10 text-accent uppercase">
                                                    Dossier_Update
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-slate-900/50 border-t border-white/10">
                    <button
                        onClick={() => { /* This could open reporting form */ }}
                        className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase rounded-xl hover:bg-red-500 hover:text-white transition-all tracking-widest flex items-center justify-center gap-2"
                    >
                        <ShieldAlert size={14} />
                        Dispatch_New_Alert
                    </button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}

import { ShieldAlert } from 'lucide-react';
