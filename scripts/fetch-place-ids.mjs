// scripts/fetch-place-ids.mjs
// Récupère les placeId + notes Google et met à jour Supabase
// Lance avec : node scripts/fetch-place-ids.mjs

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })

const VERCEL_URL = 'https://matcha-paris.vercel.app'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function searchPlace(name, address) {
  const query = `${name} ${address}`
  const url = `${VERCEL_URL}/api/place-search?query=${encodeURIComponent(query)}`
  const res = await fetch(url)
  const data = await res.json()
  if (data.places && data.places.length > 0) {
    const place = data.places[0]
    return {
      placeId: place.id,
      rating: place.rating ?? null,
      userRatingCount: place.userRatingCount ?? null,
    }
  }
  return { placeId: null, rating: null, userRatingCount: null }
}

async function main() {
  // Récupère tous les spots depuis Supabase
  const { data: spots, error } = await supabase
    .from('spots')
    .select('id, name, address, "placeId", rating')
    .order('id')

  if (error) {
    console.error('❌ Erreur lecture Supabase :', error.message)
    process.exit(1)
  }

  console.log(`📦 ${spots.length} spots à traiter...`)

  for (let i = 0; i < spots.length; i++) {
    const spot = spots[i]
    process.stdout.write(`[${String(i + 1).padStart(3, '0')}/${spots.length}] ${spot.name} ... `)

    try {
      const { placeId, rating, userRatingCount } = await searchPlace(spot.name, spot.address)

      if (placeId) {
        const { error: updateError } = await supabase
          .from('spots')
          .update({
            placeId,
            rating,
            userRatingCount,
          })
          .eq('id', spot.id)

        if (updateError) throw new Error(updateError.message)
        console.log(`✓ ${placeId} (${rating}★, ${userRatingCount} avis)`)
      } else {
        console.log('✗ non trouvé')
      }
    } catch (e) {
      console.log(`✗ erreur: ${e.message}`)
    }

    await sleep(300)
  }

  console.log('\n✅ Terminé — placeId et notes mis à jour dans Supabase')
}

main()
