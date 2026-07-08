// src/utils/isOpen.js

const DAYS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export function isOpenNow(hours) {
    if (!hours || hours.length === 0) return null

    const now = new Date()
    const day = now.getDay()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    for (const period of hours) {
        const openDay = period.open.day
        const openMinutes = period.open.hour * 60 + period.open.minute

        if (!period.close) {
            if (openDay === day) return true
            continue
        }

        const closeDay = period.close.day
        const closeMinutes = period.close.hour * 60 + period.close.minute

        if (openDay === closeDay) {
            if (day === openDay && currentMinutes >= openMinutes && currentMinutes < closeMinutes) return true
        } else {
            if (day === openDay && currentMinutes >= openMinutes) return true
            if (day === closeDay && currentMinutes < closeMinutes) return true
        }
    }

    return false
}

// Retourne l'heure de fermeture du jour actuel si le spot est ouvert
export function getCloseTime(hours) {
    if (!hours || hours.length === 0) return null
    const now = new Date()
    const day = now.getDay()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    for (const period of hours) {
        if (!period.close) continue
        const openDay = period.open.day
        const openMinutes = period.open.hour * 60 + period.open.minute
        const closeDay = period.close.day
        const closeMinutes = period.close.hour * 60 + period.close.minute

        if (openDay === closeDay && day === openDay && currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
            return `${String(period.close.hour).padStart(2, '0')}h${period.close.minute > 0 ? String(period.close.minute).padStart(2, '0') : ''}`
        }
        if (openDay !== closeDay) {
            if (day === openDay && currentMinutes >= openMinutes) {
                return `${String(period.close.hour).padStart(2, '0')}h${period.close.minute > 0 ? String(period.close.minute).padStart(2, '0') : ''}`
            }
            if (day === closeDay && currentMinutes < closeMinutes) {
                return `${String(period.close.hour).padStart(2, '0')}h${period.close.minute > 0 ? String(period.close.minute).padStart(2, '0') : ''}`
            }
        }
    }
    return null
}

// Formate les horaires de la semaine en tableau jour → "10h - 18h" ou "Fermé"
export function getWeeklyHours(hours) {
    if (!hours || hours.length === 0) return null

    const week = DAYS_FR.map((label, dayIndex) => {
        const periods = hours.filter(p => p.open.day === dayIndex)
        if (periods.length === 0) return { label, value: 'Fermé', closed: true }

        const formatted = periods.map(p => {
            const open = `${String(p.open.hour).padStart(2, '0')}h${p.open.minute > 0 ? String(p.open.minute).padStart(2, '0') : ''}`
            if (!p.close) return `${open} - ...`
            const close = `${String(p.close.hour).padStart(2, '0')}h${p.close.minute > 0 ? String(p.close.minute).padStart(2, '0') : ''}`
            return `${open} – ${close}`
        }).join(', ')

        return { label, value: formatted, closed: false }
    })

    // Réorganise pour commencer par lundi (index 1)
    return [...week.slice(1), week[0]]
}