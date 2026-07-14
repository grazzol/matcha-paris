import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

const options = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    }
}

let clientPromise

if (!uri) throw new Error('MONGODB_URI manquant')

const client = new MongoClient(uri, options)
clientPromise = client.connect()

export default clientPromise