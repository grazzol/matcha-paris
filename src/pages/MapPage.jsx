// src/pages/MapPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Map from '../components/Map'
import SuggestSpot from '../components/SuggestSpot'
import { spots } from '../data/spots'
import '../App.css'

export default function MapPage() {
    const [selected, setSelected] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [favIds, setFavIds] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem('matcha-favs') || '[]'))
        } catch { return new Set() }
    })
    const [userPos, setUserPos] = useState(null)
    const [locating, setLocating] = useState(false)
    const navigate = useNavigate()
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)

    useEffect(() => {
        localStorage.setItem('matcha-favs', JSON.stringify([...favIds]))
    }, [favIds])

    const toggleFav = (id) => {
        setFavIds(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const handleLocate = () => {
        if (!navigator.geolocation) return
        // Si déjà localisé → reset
        if (userPos) {
            setUserPos(null)
            return
        }
        setLocating(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                setLocating(false)
            },
            () => {
                setLocating(false)
                alert('Impossible d\'accéder à votre position.')
            },
            { timeout: 8000 }
        )
    }

    const handleSelect = (spot) => {
        setSelected(spot)
    }

    const sidebarProps = {
        spots,
        selected,
        onSelect: handleSelect,
        favIds,
        onToggleFav: toggleFav,
        userPos,
        onLocate: handleLocate,
        locating,
    }

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientY)
    }

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientY)
    }

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchEnd - touchStart
        if (distance > 80) setDrawerOpen(false) // swipe vers le bas > 80px
        setTouchStart(null)
        setTouchEnd(null)
    }

    return (
        <div className="layout">
            <Sidebar {...sidebarProps} className="sidebar-desktop" />

            <div className="main">
                <button className="back-btn" onClick={() => navigate('/')}>← Accueil</button>
                <Map
                    spots={spots}
                    selected={selected}
                    onSelect={handleSelect}
                    favIds={favIds}
                    userPos={userPos}
                />
                <SuggestSpot />
                <Footer />
            </div>

            <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
            <div
                className={`drawer ${drawerOpen ? 'open' : ''}`}
                onTouchStart={e => setTouchStart(e.targetTouches[0].clientY)}
                onTouchMove={e => setTouchEnd(e.targetTouches[0].clientY)}
                onTouchEnd={() => {
                    if (touchStart && touchEnd && touchEnd - touchStart > 80) {
                        setDrawerOpen(false)
                    }
                    setTouchStart(null)
                    setTouchEnd(null)
                }}
            >
                <div className="drawer-handle" onClick={() => setDrawerOpen(!drawerOpen)}>
                    <div className="drawer-pill" />
                </div>
                <Sidebar {...sidebarProps} className="sidebar-mobile" />
            </div>

            <button
                className="fab"
                onClick={() => setDrawerOpen(true)}
                aria-label="Voir la liste"
                style={{ display: drawerOpen ? 'none' : 'flex' }}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span>{spots.length} spots</span>
            </button>
        </div>
    )
}