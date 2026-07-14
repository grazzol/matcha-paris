// src/pages/MapPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import Map from '../components/Map'
import SuggestSpot from '../components/SuggestSpot'
import { useSpots } from '../hooks/useSpots'
import '../App.css'

export default function MapPage() {
    const { spots, loading, error } = useSpots()
    const [selected, setSelected] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [drawerFull, setDrawerFull] = useState(false)
    const [favIds, setFavIds] = useState(() => {
        try {
            return new Set(JSON.parse(localStorage.getItem('matcha-favs') || '[]'))
        } catch { return new Set() }
    })
    const [userPos, setUserPos] = useState(null)
    const [locating, setLocating] = useState(false)
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const navigate = useNavigate()

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
        if (spot) setDrawerFull(true)
    }

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchEnd - touchStart
        if (distance > 80) {
            if (drawerFull) setDrawerFull(false)
            else setDrawerOpen(false)
        }
        if (distance < -80) {
            if (drawerOpen) setDrawerFull(true)
            else setDrawerOpen(true)
        }
        setTouchStart(null)
        setTouchEnd(null)
    }

    if (loading) return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100vh', background: '#1a2e1e', color: '#c8dbc2',
            fontFamily: 'Cormorant Garamond, serif', fontSize: '28px',
            fontWeight: 300, letterSpacing: '0.05em'
        }}>
            Chargement des spots...
        </div>
    )

    if (error) return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100vh', background: '#1a2e1e', color: '#e85d6a',
            fontFamily: 'DM Sans, sans-serif', fontSize: '14px'
        }}>
            Erreur : {error}
        </div>
    )

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

            <div
                className={`drawer-overlay ${drawerOpen ? 'open' : ''}`}
                onClick={() => { setDrawerOpen(false); setDrawerFull(false) }}
            />
            <div
                className={`drawer ${drawerOpen ? 'open' : ''} ${drawerFull ? 'full' : ''}`}
                onTouchStart={e => setTouchStart(e.targetTouches[0].clientY)}
                onTouchMove={e => setTouchEnd(e.targetTouches[0].clientY)}
                onTouchEnd={handleTouchEnd}
            >
                <div className="drawer-handle" onClick={() => {
                    if (!drawerOpen) setDrawerOpen(true)
                    else if (!drawerFull) setDrawerFull(true)
                    else { setDrawerFull(false); setDrawerOpen(false) }
                }}>
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