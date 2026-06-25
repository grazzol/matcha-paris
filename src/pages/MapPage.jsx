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
    const navigate = useNavigate()

    return (
        <div className="layout">
            <Sidebar
                spots={spots}
                selected={selected}
                onSelect={setSelected}
            />
            <div className="main">
                {/* Bouton retour accueil */}
                <button
                    className="back-btn"
                    onClick={() => navigate('/')}
                >
                    ← Accueil
                </button>
                <Map
                    spots={spots}
                    selected={selected}
                    onSelect={setSelected}
                />
                <Footer />
            </div>
        </div>
    )
}