// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom'
import './Home.css'

export default function Home() {
    const navigate = useNavigate()

    return (
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
                    120+ adresses curatées — cafés, salons de thé.
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
                        <span className="stat-n">120+</span>
                        <span className="stat-l">adresses</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat">
                        <span className="stat-n">20</span>
                        <span className="stat-l">enseignes</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat">
                        <span className="stat-n">20</span>
                        <span className="stat-l">arrondissements</span>
                    </div>
                </div>
            </main>

            <footer className="home-footer">
                <span>Fait avec 🍵 à Paris</span>
                <span className="home-copyright">© {new Date().getFullYear()} Matcha Paris — Tous droits réservés</span>
            </footer>

        </div>
    )
}