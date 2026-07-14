// api/place-details.js
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

  const { placeId } = req.query

  if (!placeId) {
    return res.status(400).json({ error: 'placeId manquant' })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API non configurée' })
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount,regularOpeningHours,googleMapsUri,photos',
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return res.status(response.status).json({ error: errorData })
    }

    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la requête', details: error.message })
  }
}