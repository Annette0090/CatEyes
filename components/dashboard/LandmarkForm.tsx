'use client';

import React, { useState } from 'react';
import { X, MapPin, Send, Loader2, Camera } from 'lucide-react';
import { submitLandmark } from '@/app/dashboard/actions';

interface LandmarkFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const LandmarkForm = ({ isOpen, onClose }: LandmarkFormProps) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [coords, setCoords] = useState({ lat: '5.6037', lng: '-0.1870' });

    const fetchGps = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCoords({
                    lat: position.coords.latitude.toString(),
                    lng: position.coords.longitude.toString()
                });
            }, (error) => {
                alert("GPS Error: " + error.message);
            });
        }
    };

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const result = await submitLandmark(formData);

        setLoading(false);
        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: "Landmark submitted for verification!" });
            setTimeout(() => {
                onClose();
                setMessage(null);
            }, 2000);
        }
    }

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg glass border-white/10 rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                            <MapPin size={20} />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-tight text-white">Report New Landmark</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Landmark Name</label>
                            <input
                                name="name"
                                required
                                placeholder="e.g. Shell Station Bypass"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Category</label>
                                <select
                                    name="category"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all appearance-none cursor-pointer"
                                >
                                    <option value="FUEL" className="bg-slate-900">Fuel Station</option>
                                    <option value="MEDICAL" className="bg-slate-900">Medical/Pharmacy</option>
                                    <option value="TRADE" className="bg-slate-900">Market/Shop</option>
                                    <option value="REST" className="bg-slate-900">Restaurant</option>
                                    <option value="NAV" className="bg-slate-900">Navigation Point</option>
                                </select>
                            </div>
                            <div className="relative flex items-end">
                                <div className="text-[10px] absolute -top-4 left-0 font-black uppercase tracking-widest text-slate-500 mb-2">Location Detection</div>
                                <button
                                    type="button"
                                    onClick={fetchGps}
                                    className="w-full py-3 bg-white/5 border border-white/10 text-slate-400 hover:text-accent hover:border-accent/50 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold"
                                >
                                    <MapPin size={14} />
                                    FETCH_GPS
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Latitude</label>
                                <input
                                    name="latitude"
                                    step="any"
                                    required
                                    value={coords.lat}
                                    onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Longitude</label>
                                <input
                                    name="longitude"
                                    step="any"
                                    required
                                    value={coords.lng}
                                    onChange={(e) => setCoords({ ...coords, lng: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Visual Evidence (Photo)</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    name="photo"
                                    accept="image/*"
                                    className="hidden"
                                    id="photo-upload"
                                />
                                <label
                                    htmlFor="photo-upload"
                                    className="w-full bg-white/5 border border-white/10 border-dashed rounded-xl px-4 py-6 text-slate-500 hover:text-accent hover:border-accent/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                                >
                                    <Camera size={24} />
                                    <span className="text-xs font-bold uppercase tracking-widest">Select_Field_Capture</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">System Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                placeholder="Describe why this landmark is a key navigation marker..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-all resize-none"
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
                        className="w-full py-4 bg-accent text-black font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        Synchronize Node
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LandmarkForm;
