'use client';

import React, { useState } from 'react';
import { X, Settings, Moon, Sun, Monitor, Wifi, WifiOff, Bell, BellOff, Save, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Preferences {
    theme: 'dark' | 'light' | 'satellite' | 'minimal';
    lowBandwidth: boolean;
    notifications: boolean;
}

export default function PreferencesDialog({
    isOpen,
    onClose,
    initialPreferences = { theme: 'dark', lowBandwidth: false, notifications: true },
    userId
}: {
    isOpen: boolean;
    onClose: () => void;
    initialPreferences?: Preferences;
    userId: string;
}) {
    const [prefs, setPrefs] = useState<Preferences>(initialPreferences);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ preferences: prefs })
                .eq('id', userId);

            if (error) throw error;

            // Reload page to apply new theme/settings if necessary, or use a context
            window.location.reload();
        } catch (error) {
            console.error('Error saving preferences:', error);
            alert('Failed to synchronize preferences with central node.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="w-full max-w-md bg-slate-950 border border-white/10 rounded-3xl overflow-hidden glass shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                            <Settings size={18} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-white leading-none">Security Configuration</h2>
                            <span className="text-[10px] font-mono text-slate-500 uppercase">User_Interface_Protocols</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Theme Selection */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Neural Map Interface</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'dark', label: 'Dark_Grid', icon: <Moon size={14} /> },
                                { id: 'light', label: 'Light_Grid', icon: <Sun size={14} /> },
                                { id: 'satellite', label: 'Orbital_View', icon: <Monitor size={14} /> },
                                { id: 'minimal', label: 'Minimal_Entry', icon: <WifiOff size={14} /> }
                            ].map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setPrefs({ ...prefs, theme: theme.id as any })}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-xs font-bold uppercase tracking-tighter ${prefs.theme === theme.id
                                            ? 'bg-accent/10 border-accent text-accent'
                                            : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                                        }`}
                                >
                                    {theme.icon}
                                    {theme.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bandwidth Optimization */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Performance Protocols</label>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className={prefs.lowBandwidth ? 'text-orange-500' : 'text-green-500'}>
                                    {prefs.lowBandwidth ? <WifiOff size={18} /> : <Wifi size={18} />}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white uppercase tracking-tighter">Low Bandwidth Mode</div>
                                    <div className="text-[10px] text-slate-500 italic">Optimizes data throughput for field nodes</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setPrefs({ ...prefs, lowBandwidth: !prefs.lowBandwidth })}
                                className={`w-12 h-6 rounded-full transition-all relative ${prefs.lowBandwidth ? 'bg-orange-500' : 'bg-slate-800'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${prefs.lowBandwidth ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Notification Toggles */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Intelligence Alerts</label>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className={prefs.notifications ? 'text-accent' : 'text-slate-500'}>
                                    {prefs.notifications ? <Bell size={18} /> : <BellOff size={18} />}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-white uppercase tracking-tighter">Realtime Pings</div>
                                    <div className="text-[10px] text-slate-500 italic">Push alerts for incidents in local sector</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setPrefs({ ...prefs, notifications: !prefs.notifications })}
                                className={`w-12 h-6 rounded-full transition-all relative ${prefs.notifications ? 'bg-accent' : 'bg-slate-800'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${prefs.notifications ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-900/50 border-t border-white/10">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-4 bg-accent text-black text-xs font-black uppercase rounded-2xl hover:bg-accent/80 transition-all tracking-[0.2em] flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        {saving ? 'Synchronizing...' : 'Update_Neural_Profile'}
                    </button>
                </div>
            </div>
        </div>
    );
}
