// src/components/Sidebar.jsx
import { useState, useEffect, useRef } from 'react'

const TYPES = ['Tous', 'Café', 'Salon de thé', 'Épicerie']

function SpotDetail({ spot, onClose }) {
    return (
        <div className="spot-detail">
            <button className="spot-detail-close" onClick={onClose}>✕</button>
            <div className="spot-detail-type">{spot.type}</div>
            <h2 className="spot-detail-name">{spot.name}</h2>
            <p className="spot-detail-address">{spot.address}</p>

            {spot.description && (
                <p className="spot-detail-desc">{spot.description}</p>
            )}

            {spot.tags?.length > 0 && (
                <div className="spot-detail-tags">
                    {spot.tags.map(tag => (
                        <span key={tag} className="spot-tag">{tag}</span>
                    ))}
                </div>
            )}

            <div className="spot-detail-actions">
                {spot.instagram && (
                    <a
                        href={`https://instagram.com/${spot.instagram}`}
                        target="_blank"
                        rel="noreferrer"
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
                    target="_blank"
                    rel="noreferrer"
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

export default function Sidebar({ spots, onSelect, selected }) {
    const [search, setSearch] = useState('')
    const [type, setType] = useState('Tous')
    // expanded est maintenant dérivé de selected — ils sont toujours synchronisés
    const [expandedId, setExpandedId] = useState(null)
    const listRef = useRef(null)

    // Quand selected change (ex: clic sur la carte) → ouvrir le panneau
    // et scroller jusqu'au spot dans la liste
    useEffect(() => {
        if (selected) {
            setExpandedId(selected.id)
            // Scroll vers le spot sélectionné dans la liste
            const el = listRef.current?.querySelector(`[data-id="${selected.id}"]`)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [selected])

    const filtered = spots.filter(s =>
        (type === 'Tous' || s.type === type) &&
        s.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleItemClick = (spot) => {
        onSelect(spot)
        // Toggle : si déjà ouvert, ferme ; sinon ouvre
        setExpandedId(expandedId === spot.id ? null : spot.id)
    }

    const handleClose = () => {
        setExpandedId(null)
        onSelect(null)
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1>Matcha <em>Paris</em></h1>
                <p>{filtered.length} spots</p>
            </div>

            <div className="sidebar-filters">
                <input
                    type="text"
                    placeholder="Rechercher un spot…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="search-input"
                />
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
                </div>
            </div>

            <ul className="spot-list" ref={listRef}>
                {filtered.map(spot => (
                    <li key={spot.id}>
                        <div
                            data-id={spot.id}
                            className={`spot-item ${selected?.id === spot.id ? 'active' : ''}`}
                            onClick={() => handleItemClick(spot)}
                        >
                            <div className="spot-item-row">
                                <div className="spot-name">{spot.name}</div>
                                <svg
                                    className={`spot-chevron ${expandedId === spot.id ? 'open' : ''}`}
                                    width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2"
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                            <div className="spot-meta">
                                <span>{spot.type}</span>
                                {spot.rating && <span>{spot.rating}★</span>}
                            </div>
                        </div>

                        {expandedId === spot.id && (
                            <SpotDetail
                                spot={spot}
                                onClose={handleClose}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </aside>
    )
}
