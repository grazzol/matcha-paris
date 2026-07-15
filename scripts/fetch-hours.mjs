// scripts/fetch-hours.mjs
// Récupère les horaires via Google Places et met à jour Supabase
// Lance avec : node scripts/fetch-hours.mjs

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

async function fetchHours(placeId) {
    const url = `${VERCEL_URL}/api/place-details?placeId=${placeId}`
    const res = await fetch(url)
    const data = await res.json()
    const oh = data.regularOpeningHours
    if (!oh?.periods) return null
    return oh.periods.map(p => ({
        open: { day: p.open.day, hour: p.open.hour, minute: p.open.minute },
        close: p.close ? { day: p.close.day, hour: p.close.hour, minute: p.close.minute } : null,
    }))
}

async function main() {
    // Récupère tous les spots avec un placeId depuis Supabase
    const { data: spots, error } = await supabase
        .from('spots')
        .select('id, name, "placeId"')
        .not('placeId', 'is', null)
        .order('id')

    if (error) {
        console.error('❌ Erreur lecture Supabase :', error.message)
        process.exit(1)
    }

    console.log(`📦 ${spots.length} spots avec placeId à traiter...`)

    let found = 0

    for (let i = 0; i < spots.length; i++) {
        const spot = spots[i]
        process.stdout.write(`[${String(i + 1).padStart(3, '0')}/${spots.length}] ${spot.name} ... `)

        try {
            const hours = await fetchHours(spot.placeId)

            if (hours) {
                const { error: updateError } = await supabase
                    .from('spots')
                    .update({ hours })
                    .eq('id', spot.id)

                if (updateError) throw new Error(updateError.message)
                found++
                console.log(`✓ ${hours.length} plages`)
            } else {
                console.log('✗ non disponible')
            }
        } catch (e) {
            console.log(`✗ erreur: ${e.message}`)
        }

        await sleep(350)
    }

    console.log(`\n✅ Terminé — ${found}/${spots.length} spots avec horaires mis à jour dans Supabase`)
}

main()
