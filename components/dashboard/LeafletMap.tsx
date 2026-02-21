'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon missing in production/Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const IncidentIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const LeafletMap = ({ initialLandmarks = [], initialIncidents = [] }: { initialLandmarks?: any[], initialIncidents?: any[] }) => {
    const center: [number, number] = [5.6037, -0.1870]; // Accra, Ghana

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 relative z-0">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', background: '#020617' }}
            >
                {/* Dark Mode Tiles from CartoDB - Free and No Key Required */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Render Landmarks */}
                {initialLandmarks.map((landmark, idx) => (
                    <Marker
                        key={`landmark-${idx}`}
                        position={[landmark.latitude, landmark.longitude]}
                    >
                        <Popup className="custom-leaflet-popup">
                            <div className="p-1 bg-slate-900 text-white min-w-[150px]">
                                <div className="text-[10px] font-black uppercase text-accent mb-1 tracking-widest">{landmark.category}</div>
                                <div className="text-sm font-bold mb-1">{landmark.name}</div>
                                <div className="text-[10px] text-slate-400 leading-tight">{landmark.description}</div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Render Incidents */}
                {initialIncidents.map((incident, idx) => (
                    <Marker
                        key={`incident-${idx}`}
                        position={[incident.latitude, incident.longitude]}
                        icon={IncidentIcon}
                    >
                        <Popup className="custom-leaflet-popup incident-popup">
                            <div className="p-1 bg-slate-900 text-white min-w-[150px]">
                                <div className="text-[10px] font-black uppercase text-red-500 mb-1 tracking-widest">INCIDENT: {incident.type}</div>
                                <div className="text-sm font-bold mb-1">{incident.severity} SEVERITY</div>
                                <div className="text-[10px] text-slate-400 leading-tight">{incident.description}</div>
                                <div className="text-[8px] mt-2 text-slate-600 font-mono uppercase">Expires: {new Date(incident.expires_at).toLocaleTimeString()}</div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Map Overlay HUD */}
            <div className="absolute top-4 left-4 p-4 glass rounded-xl border-accent/20 pointer-events-none z-[1000]">
                <div className="text-[10px] font-mono text-accent mb-1">GRID_STATUS</div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-white uppercase tracking-tighter">Leaflet_Engine_Active</span>
                </div>
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest z-[1000]">
                CityEyes Geodata Engine [OSS]
            </div>

            <style jsx global>{`
        .leaflet-container {
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          background: #0f172a !important;
          color: white !important;
          border: 1px solid rgba(34, 211, 238, 0.2) !important;
          border-radius: 12px !important;
          padding: 0 !important;
        }
        .leaflet-popup-tip {
          background: #0f172a !important;
          border: 1px solid rgba(34, 211, 238, 0.2) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
          background-color: #0f172a !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .leaflet-control-attribution {
          background: rgba(0,0,0,0.5) !important;
          color: #64748b !important;
        }
      `}</style>
        </div>
    );
};

export default LeafletMap;
