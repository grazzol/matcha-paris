// api/place-search.js
// Fonction serverless Vercel — recherche un place_id via Text Search
// Usage : /api/place-search?query=Café Kitsuné 51 Galerie de Montpensier Paris

export default async function handler(req, res) {
    const { query } = req.query

    if (!query) {
        return res.status(400).json({ error: 'query manquant' })
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!apiKey) {
        return res.status(500).json({ error: 'Clé API non configurée côté serveur' })
    }

    try {
        const response = await fetch(
            'https://places.googleapis.com/v1/places:searchText',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount',
                },
                body: JSON.stringify({
                    textQuery: query,
                    languageCode: 'fr',
                }),
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            return res.status(response.status).json({ error: errorData })
        }

        const data = await response.json()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la requête Google Places', details: error.message })
    }
}