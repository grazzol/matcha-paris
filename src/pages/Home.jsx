// src/pages/Home.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, SITE_IMAGE } from '../utils/seo'
import { useSpots } from '../hooks/useSpots'
import Noren from '../components/Noren'
import './Home.css'

export default function Home() {
    const navigate = useNavigate()
    const { spots } = useSpots()
    const [norenDone, setNorenDone] = useState(false)

    const handleNorenComplete = () => {
        setNorenDone(true)
    }

    const totalSpots = spots.length
    const totalEnseignes = new Set(spots.map(s => s.name)).size
    const totalArrondissements = new Set(
        spots.map(s => s.address.match(/7[45]\d{3}|92200|93400/)?.[0]).filter(Boolean)
    ).size

    return (
        <>
            <Helmet>
                <title>{SITE_NAME} — Trouve ton matcha à Paris</title>
                <meta name="description" content={SITE_DESCRIPTION} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={SITE_URL} />
                <meta property="og:title" content={`${SITE_NAME} — Trouve ton matcha à Paris`} />
                <meta property="og:description" content={SITE_DESCRIPTION} />
                <meta property="og:image" content={SITE_IMAGE} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${SITE_NAME} — Trouve ton matcha à Paris`} />
                <meta name="twitter:description" content={SITE_DESCRIPTION} />
                <meta name="twitter:image" content={SITE_IMAGE} />
            </Helmet>

            {!norenDone && <Noren onComplete={handleNorenComplete} />}

            <div className="home">
                <div className="home-bg">
                    <div className="bubble b1" />
                    <div className="bubble b2" />
                    <div className="bubble b3" />
                </div>

                <main className="home-content">
                    <div className="home-eyebrow">Paris · Matcha Guide</div>

                    <h1 className="home-title">
                        Trouve ton<br />
                        <em>matcha</em><br />
                        à Paris.
                    </h1>

                    <p className="home-subtitle">
                        {totalSpots || '120'}+ adresses curatées — cafés, salons de thé.
                        <br />Filtre, explore, découvre.
                    </p>

                    <button
                        className="home-cta"
                        onClick={() => navigate('/map')}
                    >
                        Explorer la carte
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>

                    <div className="home-stats">
                        <div className="stat">
                            <span className="stat-n">{totalSpots || '120'}+</span>
                            <span className="stat-l">adresses</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-n">{totalEnseignes || '20'}</span>
                            <span className="stat-l">enseignes</span>
                        </div>
                        <div className="stat-divider" />
                        <div className="stat">
                            <span className="stat-n">{totalArrondissements || '20'}</span>
                            <span className="stat-l">secteurs</span>
                        </div>
                    </div>
                </main>

                <footer className="home-footer">
                    <span>Fait avec 🍵 à Paris</span>
                    <button onClick={() => navigate('/about')} className="home-about-btn">
                        À propos →
                    </button>
                    <span className="home-copyright">© {new Date().getFullYear()} Matcha Paris</span>
                </footer>
            </div>
        </>
    )
}