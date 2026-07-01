// src/components/Map.jsx
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

// Marqueur "Vous êtes ici" — point bleu
const userIcon = L.divIcon({
    className: '',
    html: `
        <div style="position:relative; width:20px; height:20px;">
            <div style="
                width: 20px; height: 20px;
                background: #4285f4;
                border: 3px solid #fff;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(66,133,244,0.5);
                position: absolute;
            "></div>
            <div style="
                width: 40px; height: 40px;
                background: rgba(66,133,244,0.15);
                border-radius: 50%;
                position: absolute;
                top: -10px; left: -10px;
                animation: pulse 2s infinite;
            "></div>
        </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
})

const createClusterIcon = (cluster) => {
    const count = cluster.getChildCount()
    return L.divIcon({
        className: '',
        html: `<div style="
            width: 36px; height: 36px;
            background: #2c4a32;
            border: 2.5px solid #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(44,74,50,0.35);
            font-family: 'DM Sans', sans-serif;
            font-size: 12px;
            font-weight: 600;
            color: #f5f2ec;
        ">${count}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    })
}

const matchaIcon = (name, rating, isFav) => L.divIcon({
    className: '',
    html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
            <div style="
                width: 8px; height: 8px;
                background: ${isFav ? '#e85d6a' : '#2c4a32'};
                border: 2px solid #fff;
                border-radius: 50%;
                box-shadow: ${isFav ? '0 1px 6px rgba(232,93,106,0.5)' : '0 1px 4px rgba(0,0,0,0.2)'};
                flex-shrink: 0;
            "></div>
            <div style="
                display: flex;
                align-items: center;
                gap: 4px;
                background: rgba(255,255,255,0.92);
                border: 1px solid ${isFav ? 'rgba(232,93,106,0.3)' : 'rgba(44,74,50,0.15)'};
                border-radius: 5px;
                padding: 2px 7px;
                box-shadow: 0 1px 4px rgba(0,0,0,0.08);
                backdrop-filter: blur(4px);
                white-space: nowrap;
                pointer-events: none;
            ">
                <span style="font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;color:#1a2e1e;">${name}</span>
                ${rating ? `
                <span style="width:1px;height:10px;background:rgba(44,74,50,0.2);display:inline-block;"></span>
                <span style="font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;color:#4a7c59;">★ ${rating}</span>` : ''}
                ${isFav ? `<span style="font-size:9px;margin-left:2px;color:#e85d6a;">♥</span>` : ''}
            </div>
        </div>`,
    iconSize: [140, 38],
    iconAnchor: [70, 8],
    popupAnchor: [0, -20],
})

const matchaIconActive = (name, rating, isFav) => L.divIcon({
    className: '',
    html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
            <div style="
                width: 10px; height: 10px;
                background: ${isFav ? '#e85d6a' : '#4a7c59'};
                border: 2px solid #fff;
                border-radius: 50%;
                box-shadow: ${isFav ? '0 2px 10px rgba(232,93,106,0.6)' : '0 2px 8px rgba(74,124,89,0.5)'};
                flex-shrink: 0;
            "></div>
            <div style="
                display: flex;
                align-items: center;
                gap: 4px;
                background: ${isFav ? '#8b2635' : '#2c4a32'};
                border: 1px solid rgba(255,255,255,0.15);
                border-radius: 5px;
                padding: 2px 7px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                white-space: nowrap;
                pointer-events: none;
            ">
                <span style="font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;color:#f5f2ec;">${name}</span>
                ${rating ? `
                <span style="width:1px;height:10px;background:rgba(255,255,255,0.2);display:inline-block;"></span>
                <span style="font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;color:#c8dbc2;">★ ${rating}</span>` : ''}
                ${isFav ? `<span style="font-size:9px;color:#ffb3bb;margin-left:2px;">♥</span>` : ''}
            </div>
        </div>`,
    iconSize: [140, 38],
    iconAnchor: [70, 8],
    popupAnchor: [0, -20],
})

function FlyToSelected({ selected }) {
    const map = useMap()
    useEffect(() => {
        if (selected) map.flyTo([selected.lat, selected.lng], 16, { duration: 0.9 })
    }, [selected, map])
    return null
}

function FlyToUser({ userPos }) {
    const map = useMap()
    useEffect(() => {
        if (userPos) map.flyTo([userPos.lat, userPos.lng], 15, { duration: 1.2 })
    }, [userPos, map])
    return null
}

export default function Map({ spots, selected, onSelect, favIds, userPos }) {
    return (
        <MapContainer
            center={[48.8566, 2.3522]}
            zoom={13}
            style={{ flex: 1, width: '100%' }}
            zoomControl={true}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>'
                className="map-tiles-matcha"
            />

            <FlyToSelected selected={selected} />
            <FlyToUser userPos={userPos} />

            {/* Marqueur position utilisateur */}
            {userPos && (
                <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
                    <Popup>
                        <strong>Vous êtes ici</strong>
                    </Popup>
                </Marker>
            )}

            <MarkerClusterGroup
                iconCreateFunction={createClusterIcon}
                maxClusterRadius={50}
                showCoverageOnHover={false}
                zoomToBoundsOnClick={true}
                disableClusteringAtZoom={15}
            >
                {spots.filter(s => s.lat && s.lng).map(spot => {
                    const isFav = favIds?.has(spot.id) ?? false
                    return (
                        <Marker
                            key={spot.id}
                            position={[spot.lat, spot.lng]}
                            icon={selected?.id === spot.id
                                ? matchaIconActive(spot.name, spot.rating, isFav)
                                : matchaIcon(spot.name, spot.rating, isFav)
                            }
                            eventHandlers={{ click: () => onSelect(spot) }}
                        >
                            <Popup>
                                <strong>{spot.name}</strong>
                                <span>
                                    {spot.type}
                                    {spot.rating ? ` — ★ ${spot.rating}` : ''}
                                    {spot.userRatingCount ? ` (${spot.userRatingCount} avis)` : ''}
                                </span>
                                <small>{spot.address}</small>
                            </Popup>
                        </Marker>
                    )
                })}
            </MarkerClusterGroup>
        </MapContainer>
    )
}