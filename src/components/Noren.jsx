// src/components/Noren.jsx
import { useEffect, useState } from 'react'
import './Noren.css'

export default function Noren({ onComplete }) {
    const [opening, setOpening] = useState(false)
    const [done, setDone] = useState(false)

    useEffect(() => {
        // Démarre l'ouverture après 600ms
        const t1 = setTimeout(() => setOpening(true), 600)
        // Cache complètement après l'animation
        const t2 = setTimeout(() => {
            setDone(true)
            onComplete?.()
        }, 2400)
        return () => { clearTimeout(t1); clearTimeout(t2) }
    }, [])

    if (done) return null

    return (
        <div className={`noren-overlay ${opening ? 'opening' : ''}`}>

            {/* Panneau gauche */}
            <div className="noren-panel noren-left">
                {/* Texture lin */}
                <div className="noren-texture" />
                {/* Caractères japonais */}
                <div className="noren-kanji">抹茶</div>
                {/* Photo bas gauche */}
                <div className="noren-tabi noren-tabi-left">
                    <img src="/team/pp-debora.png" alt="Débora" />
                </div>
            </div>

            {/* Panneau droit */}
            <div className="noren-panel noren-right">
                <div className="noren-texture" />
                <div className="noren-kanji">巴里</div>
                {/* Photo bas droit */}
                <div className="noren-tabi noren-tabi-right">
                    <img src="/team/pp-aurian.png" alt="Aurian" />
                </div>
            </div>

            {/* Texte central */}
            <div className={`noren-title ${opening ? 'fade-out' : ''}`}>
                <span className="noren-title-main">Matcha</span>
                <span className="noren-title-sub">Paris</span>
            </div>

            {/* Barre du haut */}
            <div className="noren-rod" />

        </div>
    )
}