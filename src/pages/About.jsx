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
                    <p className="about-placeholder">

                        <div className="about-text">
                            <p>Oui, on sait déjà que le matcha c'est une boisson avec plein de bienfaits pour la santé.</p>
                            <p>Mais pour nous c'est plus que ça, c'est une boisson qui illumine ton mood, te lance dans ta journée, te rafraichit en été, te réconforte en hiver… C'est aussi une boisson qui peut prendre différentes formes (mangue coco pour les nostalgiques de l'été, fraise pour les girlies… en shot pour les plus aventuriers).</p>
                            <p>Et puis aller dans un coffee shop pour un matcha c'est une manière de reconnecter avec tes potes, rencontrer de nouvelles personnes, te recentrer, t'avancer sur du travail et trouver du calme dans une ville bruyante. C'est un appel à retourner à la simplicité et ce qui est essentiel.</p>
                        </div>
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