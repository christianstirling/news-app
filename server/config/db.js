const mongoose = require('mongoose')
const connectDB = async () => {

    try {
        mongoose.set('strictQuery', false)
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`database connected: ${conn.connection.host}`)
    } catch (error) {
        console.log('error! database NOT connected')
    }
}
module.exports = connectDB