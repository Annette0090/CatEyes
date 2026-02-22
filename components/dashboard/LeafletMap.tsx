'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { resolveIncident } from '@/app/dashboard/incidents/actions';
import { Check } from 'lucide-react';

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

const UserIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function LocationMarker({ onLocationFound }: { onLocationFound: (pos: L.LatLng) => void }) {
    const [position, setPosition] = React.useState<L.LatLng | null>(null);
    const map = useMap();

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            onLocationFound(e.latlng);
            map.flyTo(e.latlng, 15);
        });
    }, [map, onLocationFound]);

    return position === null ? null : (
        <Marker position={position} icon={UserIcon}>
            <Popup>
                <div className="p-1 font-bold text-accent uppercase text-[10px]">Your Current Intel Node</div>
            </Popup>
        </Marker>
    )
}

const LeafletMap = ({
    initialLandmarks = [],
    initialIncidents = [],
    theme = 'dark',
    lowBandwidth = false
}: {
    initialLandmarks?: any[],
    initialIncidents?: any[],
    theme?: string,
    lowBandwidth?: boolean
}) => {
    const defaultCenter: [number, number] = [5.6037, -0.1870]; // Accra, Ghana
    const [userPosition, setUserPosition] = useState<L.LatLng | null>(null);
    const [route, setRoute] = useState<any[] | null>(null);
    const [routeInfo, setRouteInfo] = useState<{ distance: string, duration: string, targetName: string } | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [incidents, setIncidents] = useState(initialIncidents);
    const [resolvingId, setResolvingId] = useState<string | null>(null);

    const getTileLayer = () => {
        switch (theme) {
            case 'light':
                return "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
            case 'satellite':
                return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            case 'minimal':
                return "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png";
            default:
                return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
        }
    };

    useEffect(() => {
        setIncidents(initialIncidents);
    }, [initialIncidents]);

    const handleResolve = async (id: string) => {
        setResolvingId(id);
        const result = await resolveIncident(id);
        if (result.success) {
            setIncidents(prev => prev.filter(inc => inc.id !== id));
        } else {
            alert(result.error);
        }
        setResolvingId(null);
    };

    const fetchRoute = async (targetCoords: [number, number], targetName: string) => {
        if (!userPosition) return;

        setIsNavigating(true);
        try {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${userPosition.lng},${userPosition.lat};${targetCoords[1]},${targetCoords[0]}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            if (data.routes && data.routes[0]) {
                const coords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
                setRoute(coords);
                setRouteInfo({
                    distance: (data.routes[0].distance / 1000).toFixed(1) + 'km',
                    duration: Math.round(data.routes[0].duration / 60) + 'm',
                    targetName
                });
            }
        } catch (error) {
            console.error("Routing error:", error);
        }
    };

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10 relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', background: '#020617' }}
            >
                <LocationMarker onLocationFound={setUserPosition} />

                {route && (
                    <Polyline
                        positions={route}
                        pathOptions={{
                            color: theme === 'light' ? '#0891b2' : '#22d3ee',
                            weight: lowBandwidth ? 3 : 5,
                            opacity: 0.8,
                            lineJoin: 'round',
                            dashArray: (isNavigating && !lowBandwidth) ? '1, 10' : undefined
                        }}
                    />
                )}
                {/* Dynamic Tile Layer */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url={getTileLayer()}
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
                                {landmark.image_url && (
                                    <div className="w-full aspect-video rounded-lg overflow-hidden mb-2 border border-white/10">
                                        <img src={landmark.image_url} alt={landmark.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="text-[10px] text-slate-400 leading-tight mb-3">{landmark.description}</div>
                                <button
                                    onClick={() => fetchRoute([landmark.latitude, landmark.longitude], landmark.name)}
                                    className="w-full py-2 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold rounded hover:bg-accent hover:text-black transition-all uppercase tracking-widest"
                                >
                                    Engage_Nav_Uplink
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Render Incidents */}
                {incidents.map((incident, idx) => (
                    <Marker
                        key={`incident-${idx}`}
                        position={[incident.latitude, incident.longitude]}
                        icon={IncidentIcon}
                    >
                        <Popup className="custom-leaflet-popup incident-popup">
                            <div className="p-1 bg-slate-900 text-white min-w-[150px]">
                                <div className="text-[10px] font-black uppercase text-red-500 mb-1 tracking-widest">INCIDENT: {incident.type}</div>
                                <div className="text-sm font-bold mb-1">{incident.severity} SEVERITY</div>
                                {incident.image_url && (
                                    <div className="w-full aspect-video rounded-lg overflow-hidden mb-2 border border-white/10">
                                        <img src={incident.image_url} alt={incident.type} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="text-[10px] text-slate-400 leading-tight mb-3">{incident.description}</div>
                                <div className="text-[8px] mb-3 text-slate-600 font-mono uppercase">Expires: {new Date(incident.expires_at).toLocaleTimeString()}</div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => fetchRoute([incident.latitude, incident.longitude], `Incident: ${incident.type}`)}
                                        className="w-full py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold rounded hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
                                    >
                                        Intercept_Incident
                                    </button>
                                    <button
                                        onClick={() => handleResolve(incident.id)}
                                        disabled={resolvingId === incident.id}
                                        className="w-full py-2 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold rounded hover:bg-green-500 hover:text-black transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <Check size={12} />
                                        {resolvingId === incident.id ? 'Updating...' : 'Incident_Cleared'}
                                    </button>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Map Overlay HUD */}
            <div className="absolute top-2 left-2 lg:top-4 lg:left-4 p-3 lg:p-4 glass rounded-xl border-accent/20 flex flex-col gap-2 lg:gap-3 pointer-events-none z-[1000] max-w-[calc(100%-1rem)] sm:max-w-xs">
                <div>
                    <div className="text-[8px] lg:text-[10px] font-mono text-accent mb-0.5 lg:mb-1 uppercase leading-none">GRID_STATUS</div>
                    <div className="flex items-center gap-1.5 lg:gap-2">
                        <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-green-500 ${!lowBandwidth ? 'animate-pulse' : ''}`} />
                        <span className="text-[10px] lg:text-xs font-bold text-white uppercase tracking-tighter">{theme}_Mode</span>
                    </div>
                </div>

                {routeInfo && (
                    <div className="pt-2 lg:pt-3 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
                        <div className="text-[8px] lg:text-[10px] font-mono text-cyan-400 mb-0.5 lg:mb-1 leading-none uppercase">Active_Target</div>
                        <div className="text-xs lg:text-sm font-black text-white uppercase tracking-tighter mb-1.5 lg:mb-2 truncate">{routeInfo.targetName}</div>
                        <div className="flex gap-3 lg:gap-4">
                            <div>
                                <div className="text-[7px] lg:text-[8px] font-mono text-slate-500 uppercase">Dist</div>
                                <div className="text-[10px] lg:text-xs font-bold text-accent">{routeInfo.distance}</div>
                            </div>
                            <div>
                                <div className="text-[7px] lg:text-[8px] font-mono text-slate-500 uppercase">ETA</div>
                                <div className="text-[10px] lg:text-xs font-bold text-accent">{routeInfo.duration}</div>
                            </div>
                        </div>
                    </div>
                )}
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
