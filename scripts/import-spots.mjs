// scripts/import-spots.mjs
// Importe tous les spots depuis spots.js vers MongoDB Atlas
// Lance avec : node scripts/import-spots.mjs

import { MongoClient } from 'mongodb'
import { spots } from '../src/data/spots.js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })

const uri = process.env.MONGODB_URI

if (!uri) {
    console.error('❌ MONGODB_URI manquant dans .env.local')
    process.exit(1)
}

async function main() {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        console.log('✅ Connecté à MongoDB Atlas')

        const db = client.db('matcha')
        const collection = db.collection('spots')

        // Vide la collection existante
        const deleted = await collection.deleteMany({})
        console.log(`🗑️  ${deleted.deletedCount} anciens spots supprimés`)

        // Insère tous les spots
        const result = await collection.insertMany(spots)
        console.log(`✅ ${result.insertedCount} spots importés avec succès`)

        // Crée un index sur le nom pour les recherches
        await collection.createIndex({ name: 1 })
        await collection.createIndex({ 'info.prix': 1 })
        console.log('✅ Index créés')

    } catch (error) {
        console.error('❌ Erreur :', error.message)
    } finally {
        await client.close()
        console.log('🔌 Connexion fermée')
    }
}

main()
