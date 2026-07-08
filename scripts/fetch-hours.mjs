// scripts/fetch-hours.mjs
// Lance avec : node scripts/fetch-hours.mjs

import fs from 'fs'
import { spots } from '../src/data/spots.js'

const VERCEL_URL = 'https://matcha-paris.vercel.app'

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
    const results = []

    for (let i = 0; i < spots.length; i++) {
        const spot = spots[i]

        if (!spot.placeId) {
            results.push({ ...spot, hours: null })
            console.log(`[${String(i + 1).padStart(3, '0')}/${spots.length}] ✗ pas de placeId — ${spot.name}`)
            continue
        }

        process.stdout.write(`[${String(i + 1).padStart(3, '0')}/${spots.length}] ${spot.name} ... `)

        try {
            const hours = await fetchHours(spot.placeId)
            results.push({ ...spot, hours })
            console.log(hours ? `✓ ${hours.length} plages` : '✗ non disponible')
        } catch (e) {
            results.push({ ...spot, hours: null })
            console.log(`✗ erreur: ${e.message}`)
        }

        await sleep(350)
    }

    const lines = results.map(s => {
        const tagsStr = s.tags.map(t => `'${t.replace(/'/g, "\\'")}'`).join(', ')

        const hoursStr = s.hours
            ? `[\n${s.hours.map(p => {
                const close = p.close
                    ? `{ day: ${p.close.day}, hour: ${p.close.hour}, minute: ${p.close.minute} }`
                    : 'null'
                return `            { open: { day: ${p.open.day}, hour: ${p.open.hour}, minute: ${p.open.minute} }, close: ${close} },`
            }).join('\n')}\n        ]`
            : 'null'

        const infoStr = s.info ? `{
            prix: ${s.info.prix},
            place: ${s.info.place},
            pc: ${s.info.pc},
            matcha: ${s.info.matcha},
            calme: ${s.info.calme},
            originalite: ${s.info.originalite},
        }` : 'null'

        return `    {
        id: ${s.id},
        name: '${s.name.replace(/'/g, "\\'")}',
        address: '${s.address.replace(/'/g, "\\'")}',
        lat: ${s.lat},
        lng: ${s.lng},
        type: '${s.type}',
        rating: ${s.rating},
        userRatingCount: ${s.userRatingCount},
        placeId: '${s.placeId}',
        tags: [${tagsStr}],
        description: '${(s.description || '').replace(/'/g, "\\'")}',
        instagram: '${s.instagram || ''}',
        tiktok: ${s.tiktok ? JSON.stringify(s.tiktok) : 'null'},
        info: ${infoStr},
        hours: ${hoursStr},
    }`
    }).join(',\n')

    const output = `// src/data/spots.js\nexport const spots = [\n${lines},\n]\n`
    fs.writeFileSync('src/data/spots_with_hours.js', output, 'utf8')

    const found = results.filter(r => r.hours).length
    console.log(`\n✅ Terminé — ${found}/${results.length} spots avec horaires`)
    console.log('📄 Fichier généré : src/data/spots_with_hours.js')
    console.log('👉 Vérifie puis renomme en spots.js')
}

main()
