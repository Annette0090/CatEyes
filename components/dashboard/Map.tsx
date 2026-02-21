'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
    () => import('./LeafletMap'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center rounded-2xl border border-white/5">
                <div className="text-accent text-xs font-mono tracking-widest uppercase">Initializing_Geodata_Engine...</div>
            </div>
        )
    }
);

export default function Map({ initialLandmarks, initialIncidents }: { initialLandmarks?: any[], initialIncidents?: any[] }) {
    return <LeafletMap initialLandmarks={initialLandmarks} initialIncidents={initialIncidents} />;
}
