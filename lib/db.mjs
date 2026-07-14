// lib/db.js
// Connexion MongoDB réutilisable entre les fonctions serverless
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (!uri) throw new Error('MONGODB_URI manquant dans les variables d\'environnement')

if (process.env.NODE_ENV === 'development') {
    // En dev, réutilise la connexion entre les hot reloads
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise