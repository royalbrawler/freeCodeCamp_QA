const mongoose = require('mongoose')
const uri = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017')
console.assert(process.env.MONGODB_URI, 'MongoDB URI is required, trying <mongodb://127.0.0.1:27017> instead')
const db = mongoose.connect(uri)
console.assert(db, 'Could not connect to MongoDB')

module.exports = db