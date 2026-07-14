import connectDB from '../lib/db.mjs'
import mongoose from 'mongoose'

const SpotSchema = new mongoose.Schema({}, { strict: false })
const Spot = mongoose.models.spots || mongoose.model('spots', SpotSchema)

export default async function handler(req, res) {
    try {
        await connectDB()
        const spots = await Spot.find({}).lean()
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
        res.status(200).json(spots)
    } catch (error) {
        res.status(500).json({ error: 'Erreur', details: error.message })
    }
}