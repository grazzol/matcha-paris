// src/pages/MapPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Map from '../components/Map'
import { spots } from '../data/spots'
import '../App.css'

export default function MapPage() {
    const [selected, setSelected] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const navigate = useNavigate()

    const handleSelect = (spot) => {
        setSelected(spot)
        setDrawerOpen(false) // ferme le drawer sur mobile après sélection
    }

    return (
        <div className="layout">
            {/* Sidebar desktop */}
            <Sidebar
                spots={spots}
                selected={selected}
                onSelect={handleSelect}
                className="sidebar-desktop"
            />

            <div className="main">
                <button className="back-btn" onClick={() => navigate('/')}>← Accueil</button>

                <Map
                    spots={spots}
                    selected={selected}
                    onSelect={handleSelect}
                />

                <Footer />
            </div>

            {/* Drawer mobile */}
            <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
            <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
                <div className="drawer-handle" onClick={() => setDrawerOpen(!drawerOpen)}>
                    <div className="drawer-pill" />
                </div>
                <Sidebar
                    spots={spots}
                    selected={selected}
                    onSelect={handleSelect}
                    className="sidebar-mobile"
                />
            </div>

            {/* Bouton flottant mobile */}
            <button
                className="fab"
                onClick={() => setDrawerOpen(true)}
                aria-label="Voir la liste"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span>120 spots</span>
            </button>
        </div>
    )
}