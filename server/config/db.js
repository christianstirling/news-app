// /server/config/db.js

/**
 * Database Configuration
 * 
 * This module establishes a connection to the MongoDB database
 * using Mongoose and exports the `connectDB` function.
 */

const mongoose = require('mongoose')


// ============================================
// connectDB
// Establishes a connection to MongoDB using URI
// stored in environment variables.
// ============================================

const connectDB = async () => {

    try {

        // Disable strictQuery mode to allow flexible querying
        mongoose.set('strictQuery', false)

        // Connect to MongoDB using MONGO_URI from .env
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`✅ Database connected: ${conn.connection.host}`)

    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', err.message)
        process.exit(1) // Exit process with failure
    }
}

// Export the connection function for use in app.js
module.exports = connectDB