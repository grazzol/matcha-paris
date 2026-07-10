// src/pages/About.jsx
import { useNavigate } from 'react-router-dom'
import './About.css'

export default function About() {
    const navigate = useNavigate()

    return (
        <div className="about">
            <div className="about-bg">
                <div className="bubble b1" />
                <div className="bubble b2" />
            </div>

            <header className="about-header">
                <button className="about-back" onClick={() => navigate('/')}>
                    ← Accueil
                </button>
                <span className="about-logo">Matcha <em>Paris</em></span>
            </header>

            <main className="about-main">

                {/* Vision */}
                <section className="about-section">
                    <div className="about-eyebrow">Notre vision</div>
                    <h1 className="about-title">À propos</h1>
                    <p className="about-text about-placeholder">
                        [Votre mission en quelques lignes]
                    </p>
                </section>

                {/* Qui sommes-nous */}
                <section className="about-section">
                    <div className="about-eyebrow">L'équipe</div>
                    <div className="about-team">
                        <div className="about-member">
                            <img src="/team/pp-debora.png" alt="Prénom 2" className="about-avatar" />
                            <h3>Débora Asséré</h3>
                            <p>Directrice Artisitique</p>
                        </div>
                        <div className="about-member">
                            <img src="/team/pp-aurian.png" alt="Prénom 1" className="about-avatar" />
                            <h3>Aurian Baudet</h3>
                            <p>Développeur</p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="about-section">
                    <div className="about-eyebrow">Contact</div>
                    <p className="about-text about-placeholder">
                        [Email / réseaux sociaux]
                    </p>
                </section>

            </main>

            <footer className="about-footer">
                <span>© {new Date().getFullYear()} Matcha Paris — Tous droits réservés</span>
            </footer>
        </div>
    )
}