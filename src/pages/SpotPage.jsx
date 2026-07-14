// src/pages/SpotPage.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import { useSpots } from '../hooks/useSpots'
import { toSlug } from '../utils/slugify'
import { SITE_NAME, SITE_URL, SITE_IMAGE } from '../utils/seo'
import { isOpenNow, getCloseTime, getWeeklyHours } from '../utils/isOpen'
import 'leaflet/dist/leaflet.css'
import './SpotPage.css'

const spotIcon = L.divIcon({
    className: '',
    html: `
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
            <div style="
                width:10px;height:10px;
                background:#2c4a32;
                border:2px solid #fff;
                border-radius:50%;
                box-shadow:0 2px 6px rgba(0,0,0,0.25);
            "></div>
        </div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
})

function RecenterMap({ lat, lng }) {
    const map = useMap()
    useEffect(() => {
        map.setView([lat, lng], 16)
    }, [lat, lng, map])
    return null
}

function SpotMiniMap({ spot }) {
    return (
        <MapContainer
            center={[spot.lat, spot.lng]}
            zoom={16}
            style={{ height: '220px', width: '100%', borderRadius: '10px' }}
            zoomControl={true}
            scrollWheelZoom={false}
            dragging={true}
            doubleClickZoom={true}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>'
                className="map-tiles-matcha"
            />
            <Marker position={[spot.lat, spot.lng]} icon={spotIcon} />
            <RecenterMap lat={spot.lat} lng={spot.lng} />
        </MapContainer>
    )
}

export default function SpotPage() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const { spots, loading } = useSpots()

    if (loading) return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100vh', background: '#1a2e1e', color: '#c8dbc2',
            fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300,
            letterSpacing: '0.05em'
        }}>
            Chargement...
        </div>
    )

    const spot = spots.find(s => toSlug(s.name, s.address) === slug)

    if (!spot) {
        return (
            <>
                <Helmet>
                    <title>Spot introuvable · {SITE_NAME}</title>
                </Helmet>
                <div className="spot-page-error">
                    <h1>Spot introuvable</h1>
                    <button onClick={() => navigate('/map')}>← Retour à la carte</button>
                </div>
            </>
        )
    }

    const pageTitle = `${spot.name} · ${spot.address.split(',')[1]?.trim() || 'Paris'} — ${SITE_NAME}`
    const pageDesc = spot.description
        ? spot.description
        : `${spot.name} — ${spot.type} matcha à Paris. ${spot.rating ? `Note Google : ${spot.rating}★.` : ''} Découvrez l'adresse, les infos pratiques et notre avis.`
    const pageUrl = `${SITE_URL}/spot/${slug}`

    const open = isOpenNow(spot.hours)
    const closeTime = open ? getCloseTime(spot.hours) : null
    const weekly = getWeeklyHours(spot.hours)
    const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

    return (
        <>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDesc} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDesc} />
                <meta property="og:image" content={SITE_IMAGE} />
                <meta property="og:site_name" content={SITE_NAME} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDesc} />
                <meta name="twitter:image" content={SITE_IMAGE} />
                <meta name="geo.region" content="FR-75" />
                <meta name="geo.placename" content="Paris" />
            </Helmet>

            <div className="spot-page">
                <header className="spot-page-header">
                    <button className="spot-page-back" onClick={() => navigate('/map')}>
                        ← Carte
                    </button>
                    <span className="spot-page-logo">Matcha <em>Paris</em></span>
                </header>

                <main className="spot-page-main">
                    <div className="spot-page-hero">
                        <div className="spot-page-type">{spot.type}</div>
                        <h1 className="spot-page-name">{spot.name}</h1>
                        <p className="spot-page-address">{spot.address}</p>

                        {spot.rating && (
                            <div className="spot-page-rating">
                                <span className="stars">
                                    {'★'.repeat(Math.round(spot.rating))}
                                    {'☆'.repeat(5 - Math.round(spot.rating))}
                                </span>
                                <span className="rating-value">{spot.rating}</span>
                                {spot.userRatingCount && (
                                    <span className="rating-count">({spot.userRatingCount} avis Google)</span>
                                )}
                            </div>
                        )}
                    </div>

                    {spot.info && (
                        <section className="spot-page-section">
                            <h2>Infos pratiques</h2>
                            <div className="spot-page-info">
                                {spot.info.prix && (
                                    <span className="spot-page-info-badge">{'€'.repeat(spot.info.prix)}</span>
                                )}
                                {spot.info.place !== null && spot.info.place !== undefined && (
                                    <span className="spot-page-info-badge">{spot.info.place ? '🪑 Spacieux' : '🪑 Petit'}</span>
                                )}
                                {spot.info.pc !== null && spot.info.pc !== undefined && (
                                    <span className="spot-page-info-badge">{spot.info.pc ? '💻 PC ok' : '💻 PC non'}</span>
                                )}
                                {spot.info.matcha && (
                                    <span className="spot-page-info-badge">🍵 {'★'.repeat(spot.info.matcha)}</span>
                                )}
                                {spot.info.calme && (
                                    <span className="spot-page-info-badge">
                                        {spot.info.calme >= 4 ? '🤫 Calme' : spot.info.calme >= 2 ? '💬 Moyen' : '🔊 Bruyant'}
                                    </span>
                                )}
                                {spot.info.originalite && (
                                    <span className="spot-page-info-badge">✨ {'★'.repeat(spot.info.originalite)}</span>
                                )}
                            </div>
                        </section>
                    )}

                    {open !== null && (
                        <div className={`spot-open-status ${open ? 'open' : 'closed'}`}>
                            <span className="open-dot" />
                            {open
                                ? `Ouvert${closeTime ? ` · ferme à ${closeTime}` : ''}`
                                : 'Fermé'
                            }
                        </div>
                    )}

                    {weekly && (
                        <section className="spot-page-section">
                            <h2>Horaires</h2>
                            <div className="spot-hours-table">
                                {weekly.map((d, i) => (
                                    <div key={d.label} className={`hours-row ${i === today ? 'today' : ''}`}>
                                        <span className="hours-day">{d.label}</span>
                                        <span className={`hours-value ${d.closed ? 'closed' : ''}`}>{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {spot.description && (
                        <section className="spot-page-section">
                            <p className="spot-page-desc">{spot.description}</p>
                        </section>
                    )}

                    {spot.tags?.length > 0 && (
                        <section className="spot-page-section">
                            <h2>À la carte</h2>
                            <div className="spot-page-tags">
                                {spot.tags.map(tag => (
                                    <span key={tag} className="spot-page-tag">{tag}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {spot.tiktok && (
                        <section className="spot-page-section">
                            <h2>Notre visite</h2>
                            <div className="spot-page-tiktok">
                                <div className="tiktok-wrapper">
                                    <div className="tiktok-skeleton" id={`skeleton-${spot.tiktok.videoId}`} />
                                    <blockquote
                                        className="tiktok-embed"
                                        cite={`https://www.tiktok.com/@${spot.tiktok.user}/video/${spot.tiktok.videoId}`}
                                        data-video-id={spot.tiktok.videoId}
                                        style={{ maxWidth: '605px', minWidth: '325px' }}
                                        onLoad={() => {
                                            const sk = document.getElementById(`skeleton-${spot.tiktok.videoId}`)
                                            if (sk) sk.style.display = 'none'
                                        }}
                                    >
                                        <a href={`https://www.tiktok.com/@${spot.tiktok.user}/video/${spot.tiktok.videoId}`}>
                                            Voir sur TikTok
                                        </a>
                                    </blockquote>
                                    <script async src="https://www.tiktok.com/embed.js" />
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="spot-page-actions">
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' ' + spot.address)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="spot-page-btn spot-page-btn-maps"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                <circle cx="12" cy="9" r="2.5" />
                            </svg>
                            Ouvrir dans Maps
                        </a>
                        {spot.instagram && (
                            <a
                                href={`https://instagram.com/${spot.instagram}`}
                                target="_blank"
                                rel="noreferrer"
                                className="spot-page-btn spot-page-btn-instagram"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <circle cx="12" cy="12" r="4" />
                                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                                </svg>
                                @{spot.instagram}
                            </a>
                        )}
                    </section>

                    {spot.lat && spot.lng && (
                        <section className="spot-page-section">
                            <h2>Localisation</h2>
                            <div className="spot-page-map-preview">
                                <SpotMiniMap spot={spot} />
                            </div>
                        </section>
                    )}
                </main>

                <footer className="spot-page-footer">
                    <span>© {new Date().getFullYear()} Matcha Paris</span>
                    <button onClick={() => navigate('/map')}>Voir tous les spots →</button>
                </footer>
            </div>
        </>
    )
}