// api/spots.mjs
export default async function handler(req, res) {
    try {
        const response = await fetch(
            `${process.env.SUPABASE_URL}/rest/v1/spots?select=*&order=name`,
            {
                headers: {
                    'apikey': process.env.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        )

        if (!response.ok) {
            const err = await response.text()
            return res.status(response.status).json({ error: err })
        }

        const spots = await response.json()
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
        res.status(200).json(spots)
    } catch (error) {
        res.status(500).json({ error: 'Erreur', details: error.message })
    }
}
