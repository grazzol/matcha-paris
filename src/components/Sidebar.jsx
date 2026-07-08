// src/components/Sidebar.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toSlug } from '../utils/slugify'
import { isOpenNow, getCloseTime, getWeeklyHours } from '../utils/isOpen'

const TYPES = ['Tous', 'Café', 'Salon de thé']

function getCP(address) {
    const match = address.match(/7[45]\d{3}|92200|93400/)
    return match ? match[0] : null
}

function getArrondissement(address) {
    const cp = getCP(address)
    if (!cp) return null
    if (cp.startsWith('75')) {
        const num = parseInt(cp.slice(3))
        return num === 1 ? '1er' : `${num}e`
    }
    if (cp === '92200') return 'Neuilly'
    if (cp === '93400') return 'Saint-Ouen'
    return null
}

function getAvailableArrondissements(spots) {
    const set = new Set()
    spots.forEach(s => {
        const cp = getCP(s.address)
        if (cp) set.add(cp)
    })
    return Array.from(set).sort((a, b) => {
        if (a.startsWith('75') && b.startsWith('75')) return parseInt(a.slice(3)) - parseInt(b.slice(3))
        if (a.startsWith('75')) return -1
        if (b.startsWith('75')) return 1
        return a.localeCompare(b)
    })
}

function cpToLabel(cp) {
    if (cp.startsWith('75')) {
        const num = parseInt(cp.slice(3))
        return num === 1 ? '1er arr.' : `${num}e arr.`
    }
    if (cp === '92200') return 'Neuilly-sur-Seine'
    if (cp === '93400') return 'Saint-Ouen'
    return cp
}

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDistance(meters) {
    if (meters < 1000) return `${Math.round(meters)}m`
    return `${(meters / 1000).toFixed(1)}km`
}

function infoScore(spot, infoFilters) {
    if (!infoFilters || Object.keys(infoFilters).length === 0) return 0
    let score = 0
    const info = spot.info
    if (!info) return 0
    if (infoFilters.prix && info.prix === infoFilters.prix) score++
    if (infoFilters.place !== undefined && info.place === infoFilters.place) score++
    if (infoFilters.pc !== undefined && info.pc === infoFilters.pc) score++
    if (infoFilters.matcha && info.matcha >= infoFilters.matcha) score++
    if (infoFilters.calme && info.calme >= infoFilters.calme) score++
    if (infoFilters.originalite && info.originalite >= infoFilters.originalite) score++
    return score
}

function HeartIcon({ filled }) {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24"
            fill={filled ? '#e85d6a' : 'none'}
            stroke={filled ? '#e85d6a' : 'currentColor'}
            strokeWidth="2"
        >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    )
}

function HoursBlock({ hours }) {
    const open = isOpenNow(hours)
    const closeTime = open ? getCloseTime(hours) : null
    const weekly = getWeeklyHours(hours)
    const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

    if (!hours) return null

    return (
        <>
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
                <div className="spot-hours-table">
                    {weekly.map((d, i) => (
                        <div key={d.label} className={`hours-row ${i === today ? 'today' : ''}`}>
                            <span className="hours-day">{d.label}</span>
                            <span className={`hours-value ${d.closed ? 'closed' : ''}`}>{d.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

function SpotDetail({ spot, onClose, isFav, onToggleFav, distance }) {
    const navigate = useNavigate()

    return (
        <div className="spot-detail">
            <button className="spot-detail-close" onClick={onClose}>✕</button>

            <div className="spot-detail-type">{spot.type}</div>

            <div className="spot-detail-name-row">
                <h2 className="spot-detail-name">{spot.name}</h2>
                <button
                    className="fav-btn-detail"
                    onClick={e => { e.stopPropagation(); onToggleFav(spot.id) }}
                    title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                    <HeartIcon filled={isFav} />
                </button>
            </div>

            <p className="spot-detail-address">
                {spot.address}
                {distance != null && <span className="spot-detail-distance"> · {formatDistance(distance)}</span>}
            </p>

            <HoursBlock hours={spot.hours} />

            {spot.rating && (
                <div className="spot-detail-rating">
                    {'★'.repeat(Math.round(spot.rating))}{'☆'.repeat(5 - Math.round(spot.rating))}
                    <span> {spot.rating}{spot.userRatingCount ? ` (${spot.userRatingCount} avis)` : ''}</span>
                </div>
            )}

            {spot.info && (
                <div className="spot-detail-info">
                    {spot.info.prix && <span className="info-badge">{'€'.repeat(spot.info.prix)}</span>}
                    {spot.info.place !== null && spot.info.place !== undefined && (
                        <span className="info-badge">{spot.info.place ? '🪑 Spacieux' : '🪑 Petit'}</span>
                    )}
                    {spot.info.pc !== null && spot.info.pc !== undefined && (
                        <span className="info-badge">{spot.info.pc ? '💻 PC ok' : '💻 PC non'}</span>
                    )}
                    {spot.info.matcha && <span className="info-badge">🍵 {'★'.repeat(spot.info.matcha)}</span>}
                    {spot.info.calme && (
                        <span className="info-badge">
                            {spot.info.calme >= 4 ? '🤫 Calme' : spot.info.calme >= 2 ? '💬 Moyen' : '🔊 Bruyant'}
                        </span>
                    )}
                    {spot.info.originalite && <span className="info-badge">✨ {'★'.repeat(spot.info.originalite)}</span>}
                </div>
            )}

            {spot.description && <p className="spot-detail-desc">{spot.description}</p>}

            {spot.tags?.length > 0 && (
                <div className="spot-detail-tags">
                    {spot.tags.map(tag => <span key={tag} className="spot-tag">{tag}</span>)}
                </div>
            )}

            <div className="spot-detail-actions">
                <button
                    className="spot-action-btn spot-action-page"
                    onClick={() => navigate(`/spot/${toSlug(spot.name, spot.address)}`)}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Voir la page du spot
                </button>

                {spot.instagram && (
                    <a
                        href={`https://instagram.com/${spot.instagram}`}
                        target="_blank" rel="noreferrer"
                        className="spot-action-btn spot-action-instagram"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                        </svg>
                        @{spot.instagram}
                    </a>
                )}

                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + ' ' + spot.address)}`}
                    target="_blank" rel="noreferrer"
                    className="spot-action-btn spot-action-maps"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    Ouvrir dans Maps
                </a>
            </div>
        </div>
    )
}

function FilterDropdown({ label, active, open, onToggle, onClear }) {
    return (
        <div className="arr-filter-row">
            <button
                className={`filter-btn arr-toggle ${active ? 'active' : ''}`}
                onClick={onToggle}
            >
                {label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ marginLeft: 4, transform: open ? 'rotate(180deg)' : 'none', transition: '0.18s' }}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
            {active && (
                <button className="filter-btn arr-clear" onClick={onClear}>✕</button>
            )}
        </div>
    )
}

export default function Sidebar({ spots, onSelect, selected, className, favIds, onToggleFav, userPos, onLocate, locating }) {
    const [search, setSearch] = useState('')
    const [type, setType] = useState('Tous')
    const [arrFilter, setArrFilter] = useState(null)
    const [showArrFilter, setShowArrFilter] = useState(false)
    const [infoFilters, setInfoFilters] = useState({})
    const [showInfoFilter, setShowInfoFilter] = useState(false)
    const [expandedId, setExpandedId] = useState(null)
    const [showFavsOnly, setShowFavsOnly] = useState(false)
    const [openNowOnly, setOpenNowOnly] = useState(false)
    const [diceAnim, setDiceAnim] = useState(false)
    const listRef = useRef(null)

    const availableArr = getAvailableArrondissements(spots)
    const hasInfoFilter = Object.keys(infoFilters).length > 0

    useEffect(() => {
        if (selected) {
            setExpandedId(selected.id)
            const el = listRef.current?.querySelector(`[data-id="${selected.id}"]`)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [selected])

    const handleRandom = () => {
        const validSpots = spots.filter(s => s.lat && s.lng)
        const spot = validSpots[Math.floor(Math.random() * validSpots.length)]
        onSelect(spot)
        setExpandedId(spot.id)
        setDiceAnim(true)
        setTimeout(() => setDiceAnim(false), 600)
        setTimeout(() => {
            const el = listRef.current?.querySelector(`[data-id="${spot.id}"]`)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }, 100)
    }

    const toggleInfoFilter = (key, value) => {
        setInfoFilters(prev => {
            const next = { ...prev }
            if (next[key] === value) delete next[key]
            else next[key] = value
            return next
        })
    }

    const spotsWithDistance = spots.map(s => ({
        ...s,
        distance: userPos && s.lat && s.lng
            ? getDistance(userPos.lat, userPos.lng, s.lat, s.lng)
            : null
    }))

    const filtered = spotsWithDistance
        .filter(s => {
            const matchType = type === 'Tous' || s.type === type
            const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
            const matchArr = !arrFilter || getCP(s.address) === arrFilter
            const matchFav = !showFavsOnly || favIds.has(s.id)
            const matchOpen = !openNowOnly || isOpenNow(s.hours) === true
            return matchType && matchSearch && matchArr && matchFav && matchOpen
        })
        .sort((a, b) => {
            if (userPos && a.distance != null && b.distance != null) return a.distance - b.distance
            if (hasInfoFilter) {
                const scoreB = infoScore(b, infoFilters)
                const scoreA = infoScore(a, infoFilters)
                if (scoreA !== scoreB) return scoreB - scoreA
            }
            return a.name.localeCompare(b.name, 'fr')
        })

    const handleItemClick = (spot) => {
        onSelect(spot)
        setExpandedId(expandedId === spot.id ? null : spot.id)
    }

    const handleClose = () => {
        setExpandedId(null)
        onSelect(null)
    }

    return (
        <aside className={`sidebar ${className || ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-header-top">
                    <h1>Matcha <em>Paris</em></h1>
                    <div className="sidebar-header-actions">
                        <button
                            className={`locate-btn ${userPos ? 'active' : ''} ${locating ? 'locating' : ''}`}
                            onClick={onLocate}
                            title="Autour de moi"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                                <circle cx="12" cy="12" r="8" strokeOpacity="0.3" />
                            </svg>
                        </button>
                        <button
                            className={`random-btn ${diceAnim ? 'spin' : ''}`}
                            onClick={handleRandom}
                            title="Spot aléatoire"
                        >
                            🎲
                        </button>
                        <button
                            className={`fav-filter-btn ${showFavsOnly ? 'active' : ''}`}
                            onClick={() => setShowFavsOnly(!showFavsOnly)}
                            title="Mes favoris"
                        >
                            <HeartIcon filled={showFavsOnly} />
                            {favIds.size > 0 && <span className="fav-count">{favIds.size}</span>}
                        </button>
                    </div>
                </div>
                <p>
                    {filtered.length} spots
                    {showFavsOnly ? ' • favoris' : ''}
                    {userPos ? ' • distance' : ''}
                    {openNowOnly ? ' • ouverts' : ''}
                    {hasInfoFilter ? ' • filtré' : ''}
                </p>
            </div>

            <div className="sidebar-filters">
                <input
                    type="text"
                    placeholder="Rechercher un spot…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="search-input"
                />

                {/* Filtres type + ouvert maintenant sur la même ligne */}
                <div className="type-filters">
                    {TYPES.map(t => (
                        <button
                            key={t}
                            className={`filter-btn ${type === t ? 'active' : ''}`}
                            onClick={() => setType(t)}
                        >
                            {t}
                        </button>
                    ))}
                    <button
                        className={`filter-btn open-now-filter ${openNowOnly ? 'active' : ''}`}
                        onClick={() => setOpenNowOnly(!openNowOnly)}
                    >
                        <span className={`open-now-dot ${openNowOnly ? 'active' : ''}`} />
                        Ouvert
                    </button>
                </div>

                <FilterDropdown
                    label={arrFilter ? `📍 ${cpToLabel(arrFilter)}` : 'Arrondissement'}
                    active={!!arrFilter}
                    open={showArrFilter}
                    onToggle={() => setShowArrFilter(!showArrFilter)}
                    onClear={() => { setArrFilter(null); setShowArrFilter(false) }}
                />
                {showArrFilter && (
                    <div className="arr-dropdown">
                        {availableArr.map(cp => (
                            <button
                                key={cp}
                                className={`arr-option ${arrFilter === cp ? 'active' : ''}`}
                                onClick={() => { setArrFilter(cp); setShowArrFilter(false) }}
                            >
                                {cpToLabel(cp)}
                            </button>
                        ))}
                    </div>
                )}

                <FilterDropdown
                    label="Infos pratiques"
                    active={hasInfoFilter}
                    open={showInfoFilter}
                    onToggle={() => setShowInfoFilter(!showInfoFilter)}
                    onClear={() => setInfoFilters({})}
                />
                {showInfoFilter && (
                    <div className="info-dropdown">
                        <div className="info-filter-group">
                            <span className="info-filter-label">Prix</span>
                            <div className="info-filter-options">
                                {[1, 2, 3].map(p => (
                                    <button key={p} className={`arr-option ${infoFilters.prix === p ? 'active' : ''}`} onClick={() => toggleInfoFilter('prix', p)}>
                                        {'€'.repeat(p)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="info-filter-group">
                            <span className="info-filter-label">Place</span>
                            <div className="info-filter-options">
                                <button className={`arr-option ${infoFilters.place === true ? 'active' : ''}`} onClick={() => toggleInfoFilter('place', true)}>🪑 Spacieux</button>
                                <button className={`arr-option ${infoFilters.place === false ? 'active' : ''}`} onClick={() => toggleInfoFilter('place', false)}>🪑 Petit</button>
                            </div>
                        </div>
                        <div className="info-filter-group">
                            <span className="info-filter-label">Travail au PC</span>
                            <div className="info-filter-options">
                                <button className={`arr-option ${infoFilters.pc === true ? 'active' : ''}`} onClick={() => toggleInfoFilter('pc', true)}>💻 Possible</button>
                                <button className={`arr-option ${infoFilters.pc === false ? 'active' : ''}`} onClick={() => toggleInfoFilter('pc', false)}>💻 Non</button>
                            </div>
                        </div>
                        <div className="info-filter-group">
                            <span className="info-filter-label">Qualité matcha (min)</span>
                            <div className="info-filter-options">
                                {[3, 4, 5].map(n => (
                                    <button key={n} className={`arr-option ${infoFilters.matcha === n ? 'active' : ''}`} onClick={() => toggleInfoFilter('matcha', n)}>
                                        {'★'.repeat(n)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="info-filter-group">
                            <span className="info-filter-label">Ambiance</span>
                            <div className="info-filter-options">
                                <button className={`arr-option ${infoFilters.calme === 4 ? 'active' : ''}`} onClick={() => toggleInfoFilter('calme', 4)}>🤫 Calme</button>
                                <button className={`arr-option ${infoFilters.calme === 2 ? 'active' : ''}`} onClick={() => toggleInfoFilter('calme', 2)}>🔊 Animé</button>
                            </div>
                        </div>
                        <div className="info-filter-group">
                            <span className="info-filter-label">Originalité recettes (min)</span>
                            <div className="info-filter-options">
                                {[3, 4, 5].map(n => (
                                    <button key={n} className={`arr-option ${infoFilters.originalite === n ? 'active' : ''}`} onClick={() => toggleInfoFilter('originalite', n)}>
                                        {'★'.repeat(n)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ul className="spot-list" ref={listRef}>
                {filtered.length === 0 && (
                    <li className="spot-empty">
                        {showFavsOnly ? "Aucun favori pour l'instant 🍵" : openNowOnly ? 'Aucun spot ouvert en ce moment' : 'Aucun spot trouvé'}
                    </li>
                )}
                {filtered.map(spot => {
                    const openStatus = isOpenNow(spot.hours)
                    return (
                        <li key={spot.id}>
                            <div
                                data-id={spot.id}
                                className={`spot-item ${selected?.id === spot.id ? 'active' : ''}`}
                                onClick={() => handleItemClick(spot)}
                            >
                                <div className="spot-item-row">
                                    <div className="spot-name">{spot.name}</div>
                                    <div className="spot-item-actions">
                                        {openStatus !== null && (
                                            <span
                                                className={`spot-open-dot ${openStatus ? 'open' : 'closed'}`}
                                                title={openStatus ? 'Ouvert' : 'Fermé'}
                                            />
                                        )}
                                        <button
                                            className="fav-btn"
                                            onClick={e => { e.stopPropagation(); onToggleFav(spot.id) }}
                                            title={favIds.has(spot.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                        >
                                            <HeartIcon filled={favIds.has(spot.id)} />
                                        </button>
                                        <svg
                                            className={`spot-chevron ${expandedId === spot.id ? 'open' : ''}`}
                                            width="14" height="14" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="spot-meta">
                                    <span>{spot.type}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {spot.distance != null && <span className="spot-distance">{formatDistance(spot.distance)}</span>}
                                        {spot.info?.prix && <span className="spot-prix">{'€'.repeat(spot.info.prix)}</span>}
                                        {spot.rating && <span className="spot-rating-badge">★ {spot.rating}</span>}
                                        {!userPos && <span className="spot-arr">{getArrondissement(spot.address)}</span>}
                                    </div>
                                </div>
                            </div>
                            {expandedId === spot.id && (
                                <SpotDetail
                                    spot={spot}
                                    onClose={handleClose}
                                    isFav={favIds.has(spot.id)}
                                    onToggleFav={onToggleFav}
                                    distance={spot.distance}
                                />
                            )}
                        </li>
                    )
                })}
            </ul>
        </aside>
    )
}