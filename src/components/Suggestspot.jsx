// src/components/SuggestSpot.jsx
import { useState } from 'react'

export default function SuggestSpot() {
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState('idle') // idle | sending | success | error
    const [form, setForm] = useState({ name: '', address: '', comment: '' })

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setStatus('sending')
        try {
            const res = await fetch('https://formspree.io/f/xzdlkprk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                setStatus('success')
                setForm({ name: '', address: '', comment: '' })
                setTimeout(() => { setStatus('idle'); setOpen(false) }, 3000)
            } else {
                setStatus('error')
            }
        } catch {
            setStatus('error')
        }
    }

    return (
        <>
            {/* Bouton flottant */}
            <button className="suggest-fab" onClick={() => setOpen(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Suggérer un spot
            </button>

            {/* Overlay */}
            {open && (
                <div className="suggest-overlay" onClick={() => setOpen(false)}>
                    <div className="suggest-popup" onClick={e => e.stopPropagation()}>
                        <button className="suggest-close" onClick={() => setOpen(false)}>✕</button>

                        <div className="suggest-header">
                            <h3>Tu connais un spot matcha ?</h3>
                            <p>Suggère-le nous, on l'ajoutera à la carte 🍵</p>
                        </div>

                        {status === 'success' ? (
                            <div className="suggest-success">
                                <span>✓</span>
                                <p>Merci ! On regarde ça au plus vite.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="suggest-form">
                                <label>
                                    Nom du spot *
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="ex: Café Kitsuné"
                                        required
                                    />
                                </label>
                                <label>
                                    Adresse *
                                    <input
                                        type="text"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="ex: 51 Galerie de Montpensier, 75001"
                                        required
                                    />
                                </label>
                                <label>
                                    Commentaire
                                    <textarea
                                        name="comment"
                                        value={form.comment}
                                        onChange={handleChange}
                                        placeholder="Un petit mot sur le spot (optionnel)"
                                        rows={3}
                                    />
                                </label>
                                <button
                                    type="submit"
                                    className="suggest-submit"
                                    disabled={status === 'sending'}
                                >
                                    {status === 'sending' ? 'Envoi…' : 'Envoyer la suggestion'}
                                </button>
                                {status === 'error' && (
                                    <p className="suggest-error">Une erreur est survenue, réessaie.</p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}