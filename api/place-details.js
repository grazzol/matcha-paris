// api/place-details.js
// Fonction serverless Vercel — proxy sécurisé vers Google Places API (New)
// La clé API reste côté serveur, jamais exposée au frontend.

export default async function handler(req, res) {
  const { placeId } = req.query

  if (!placeId) {
    return res.status(400).json({ error: 'placeId manquant' })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API non configurée côté serveur' })
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount,currentOpeningHours,googleMapsUri,photos',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return res.status(response.status).json({ error: errorData })
    }

    const data = await response.json()

    // Cache la réponse côté CDN Vercel pendant 24h pour limiter les appels API
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la requête Google Places', details: error.message })
  }
}