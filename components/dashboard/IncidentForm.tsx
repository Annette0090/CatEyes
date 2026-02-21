'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, Send, Loader2, TrafficCone, ShieldAlert, Car } from 'lucide-react';
import { reportIncident } from '@/app/dashboard/incidents/actions';

interface IncidentFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const IncidentForm = ({ isOpen, onClose }: IncidentFormProps) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const result = await reportIncident(formData);

        setLoading(false);
        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: "Incident broadcast to the grid!" });
            setTimeout(() => {
                onClose();
                setMessage(null);
            }, 2000);
        }
    }

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg glass border-red-500/20 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-red-500/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                            <AlertTriangle size={20} />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-tight text-white">Report Incident</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Incident Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { id: 'TRAFFIC', label: 'Traffic', icon: <TrafficCone size={14} /> },
                                    { id: 'HAZARD', label: 'Hazard', icon: <AlertTriangle size={14} /> },
                                    { id: 'ACCIDENT', label: 'Accident', icon: <Car size={14} /> },
                                    { id: 'POLICE', label: 'Police', icon: <ShieldAlert size={14} /> },
                                ].map((type) => (
                                    <label key={type.id} className="cursor-pointer">
                                        <input type="radio" name="type" value={type.id} className="sr-only peer" defaultChecked={type.id === 'TRAFFIC'} />
                                        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 peer-checked:bg-red-500/10 peer-checked:border-red-500/50 peer-checked:text-red-500 transition-all text-xs font-bold uppercase tracking-tight">
                                            {type.icon}
                                            {type.label}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Severity</label>
                                <select
                                    name="severity"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all appearance-none cursor-pointer text-sm"
                                >
                                    <option value="LOW" className="bg-slate-900">Low Detail</option>
                                    <option value="MEDIUM" className="bg-slate-900" selected>Medium Impact</option>
                                    <option value="HIGH" className="bg-slate-900">High Alert</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Target Sector</label>
                                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 font-mono text-[10px] flex items-center justify-center h-[46px]">
                                    SEC_DELTA_07
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Hidden but required for action */}
                            <input type="hidden" name="latitude" value="5.6037" />
                            <input type="hidden" name="longitude" value="-0.1870" />
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Incident Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                required
                                placeholder="Specific location details or obstacle description..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all resize-none text-sm"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        Broadcast Incident
                    </button>
                </form>
            </div>
        </div>
    );
};

export default IncidentForm;
