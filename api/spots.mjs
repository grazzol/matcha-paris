import clientPromise from '../lib/db.mjs'

const ALLOWED_ORIGINS = [
    'https://matcha-paris.vercel.app',
    'http://localhost:5173',
    'http://localhost:4000',
]

function isAllowed(req) {
    const origin = req.headers.origin || req.headers.referer || ''
    return ALLOWED_ORIGINS.some(o => origin.startsWith(o))
}

export default async function handler(req, res) {
    if (!isAllowed(req)) {
        return res.status(403).json({ error: 'Accès refusé' })
    }

    try {
        const client = await clientPromise
        const db = client.db('matcha')
        const spots = await db.collection('spots').find({}).toArray()
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
        res.status(200).json(spots)
    } catch (error) {
        res.status(500).json({ error: 'Erreur base de données', details: error.message })
    }
}