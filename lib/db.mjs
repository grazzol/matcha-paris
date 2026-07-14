import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
    tls: true,
    tlsAllowInvalidCertificates: false,
}

let client
let clientPromise

if (!uri) throw new Error('MONGODB_URI manquant')

client = new MongoClient(uri, options)
clientPromise = client.connect()

export default clientPromise