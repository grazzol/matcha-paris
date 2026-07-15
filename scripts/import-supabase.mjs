// scripts/import-supabase.mjs
// Importe tous les spots depuis spots.js vers Supabase
// Lance avec : node scripts/import-supabase.mjs

import { createClient } from '@supabase/supabase-js'
import { spots } from '../src/data/spots.js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
)

async function main() {
    console.log(`📦 Import de ${spots.length} spots vers Supabase...`)

    // Vide la table d'abord
    const { error: deleteError } = await supabase
        .from('spots')
        .delete()
        .neq('id', 0)

    if (deleteError) {
        console.error('❌ Erreur suppression :', deleteError.message)
        process.exit(1)
    }
    console.log('🗑️  Table vidée')

    // Formate les spots pour Supabase (camelCase → snake_case pour les colonnes)
    const formatted = spots.map(s => ({
        id: s.id,
        name: s.name,
        address: s.address,
        lat: s.lat,
        lng: s.lng,
        type: s.type,
        rating: s.rating,
        userRatingCount: s.userRatingCount,
        placeId: s.placeId,
        tags: s.tags,
        description: s.description || '',
        instagram: s.instagram || '',
        tiktok: s.tiktok,
        info: s.info,
        hours: s.hours,
    }))

    // Insère par batch de 50
    const batchSize = 50
    for (let i = 0; i < formatted.length; i += batchSize) {
        const batch = formatted.slice(i, i + batchSize)
        const { error } = await supabase.from('spots').insert(batch)
        if (error) {
            console.error(`❌ Erreur batch ${i}-${i + batchSize} :`, error.message)
            process.exit(1)
        }
        console.log(`✅ ${Math.min(i + batchSize, formatted.length)}/${formatted.length} spots importés`)
    }

    console.log('🎉 Import terminé avec succès !')
}

main()
