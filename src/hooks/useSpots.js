// src/hooks/useSpots.js
// Fetch les spots depuis l'API MongoDB au lieu du fichier statique
import { useState, useEffect } from 'react'

export function useSpots() {
    const [spots, setSpots] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('/api/spots')
            .then(res => {
                if (!res.ok) throw new Error('Erreur lors du chargement des spots')
                return res.json()
            })
            .then(data => {
                setSpots(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    return { spots, loading, error }
}