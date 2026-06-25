// src/components/Map.jsx
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix bug Vite : icônes Leaflet manquantes
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

// Icône personnalisée — point vert matcha
const matchaIcon = (name) => L.divIcon({
    className: '',
    html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:3px;">
            <div style="
                width: 10px; height: 10px;
                background: #2c4a32;
                border: 2px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            "></div>
            <span style="
                font-family: 'DM Sans', sans-serif;
                font-size: 10px;
                font-weight: 600;
                color: #1a2e1e;
                white-space: nowrap;
                background: rgba(255,255,255,0.75);
                padding: 1px 5px;
                border-radius: 4px;
                backdrop-filter: blur(2px);
                pointer-events: none;
                letter-spacing: 0.01em;
            ">${name}</span>
        </div>`,
    iconSize: [120, 32],
    iconAnchor: [60, 10],
    popupAnchor: [0, -14],
})

const matchaIconActive = (name) => L.divIcon({
    className: '',
    html: `
        <div style="display:flex; flex-direction:column; align-items:center; gap:3px;">
            <div style="
                width: 14px; height: 14px;
                background: #4a7c59;
                border: 2px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 2px 12px rgba(74,124,89,0.6);
            "></div>
            <span style="
                font-family: 'DM Sans', sans-serif;
                font-size: 10px;
                font-weight: 600;
                color: #ffffff;
                white-space: nowrap;
                background: #2c4a32;
                padding: 1px 5px;
                border-radius: 4px;
                pointer-events: none;
                letter-spacing: 0.01em;
            ">${name}</span>
        </div>`,
    iconSize: [120, 32],
    iconAnchor: [60, 10],
    popupAnchor: [0, -14],
})

function FlyToSelected({ selected }) {
    const map = useMap()
    useEffect(() => {
        if (selected) map.flyTo([selected.lat, selected.lng], 16, { duration: 0.9 })
    }, [selected, map])
    return null
}

export default function Map({ spots, selected, onSelect }) {
    return (
        <MapContainer
            center={[48.8566, 2.3522]}
            zoom={13}
            style={{ flex: 1, width: '100%' }}
            zoomControl={true}
        >
            {/*
        Tuiles CartoDB Positron — carte très claire et minimaliste,
        parfaite base pour le filtre CSS matcha ci-dessous.
        Le filtre hue-rotate + sepia donne une teinte off-white chaude
        cohérente avec la palette.
      */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>'
                className="map-tiles-matcha"
            />

            <FlyToSelected selected={selected} />

            {spots.map(spot => (
                <Marker
                    key={spot.id}
                    position={[spot.lat, spot.lng]}
                    icon={selected?.id === spot.id ? matchaIconActive(spot.name) : matchaIcon(spot.name)}
                    eventHandlers={{ click: () => onSelect(spot) }}
                >
                    <Popup>
                        <strong>{spot.name}</strong>
                        <span>{spot.type}{spot.rating ? ` — ${spot.rating}★` : ''}</span>
                        <small>{spot.address}</small>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
